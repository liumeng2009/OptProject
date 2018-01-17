import { Component,OnInit,ViewChild } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {TotalService} from "./total.service";
import {ApiResultService} from "../main/apiResult.service";
import {AjaxExceptionService} from "../main/ajaxExceptionService";

import { PlotBand, ChartComponent } from '@progress/kendo-angular-charts';

import {OperationUtil} from '../../util/logic/operation';

@Component({
  selector:'total-area',
  templateUrl:'./total.component.html',
  styleUrls:['./total.component.scss']
})

export class TotalComponent implements OnInit{

  private height={height:'0px'};

  constructor(
    private totalService:TotalService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService
  ){};

  ngOnInit(){
    this.height.height = (window.document.body.clientHeight - 70 - 56 - 50 - 20-27)+'px';
    this.getOperationList();
    //this.getDoingList();
    this.getActionList();
    this.getOperationWeekList();
  }

  private nostart:number=0;
  private start:number=0;
  private end:number=0;
  private getOperationList(){
    this.nostart=0;
    this.start=0;
    this.end=0;
    let date=new Date();
    let time=date.getTime();
    this.totalService.getOperationList(time).then(
      data=>{
        let result=this.apiResultService.result(data);
        let d=result.data;
        let operationUtil=new OperationUtil();
        let newD=operationUtil.setStatus(d,time);

        for(let nd of newD){
          if(nd.complete==0){
            this.nostart=this.nostart+1
          }
          else if(nd.complete==1||nd.complete==3){
            this.start=this.start+1;
          }
          else if(nd.complete==2){
            this.end=this.end+1;
          }
          else{

          }
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private doingList=[];
  private getDoingList(){
    let date=new Date();
    let time=date.getTime();
    this.totalService.getDoingList(time).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.doingList=result.data;
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error)
      }
    )
  }

  private actionList=[];
  private actionListHeight:number=120;
  private isLoading:boolean=false;
  private getActionList(){
    this.actionList.splice(0,this.actionList.length);
    this.isLoading=true;
    let date=new Date();
    let time=date.getTime();
    this.totalService.getActionList(time).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          //得到数据后，对这些数据进行规整 指派 开始 结束 均是事件，这些事件，由谁发生，再按照时间进行排序
          if(result.data.length>0){
            this.actionListHeight=300;
          }
          for(let r of result.data){
            if(r.call_time&&r.call_time<time){
              let obj={
                time:r.call_time,
                user:r.user.name,
                type:'被指派',
                goWhere:r.operation.order.corporation.name,
                doWhat:r.operation.businessContent.equipment+' '+r.operation.businessContent.equipOp.name,
                operationNo:r.operation.no,
                operationId:r.operation.id
              }
              this.actionList.push(obj);
            }
            if(r.start_time&&r.start_time<time){
              let obj1={
                time:r.start_time,
                user:r.user.name,
                type:'开始',
                goWhere:r.operation.order.corporation.name,
                doWhat:r.operation.businessContent.equipment+' '+r.operation.businessContent.equipOp.name,
                operationNo:r.operation.no,
                operationId:r.operation.id
              }
              this.actionList.push(obj1);
            }
            if(r.end_time&&r.end_time<time){
              let obj2={
                time:r.end_time,
                user:r.user.name,
                type:'完成',
                goWhere:r.operation.order.corporation.name,
                doWhat:r.operation.businessContent.equipment+' '+r.operation.businessContent.equipOp.name,
                operationNo:r.operation.no,
                operationId:r.operation.id
              }
              this.actionList.push(obj2);
            }
          }

          //按照time字段对actionList进行排序
          for(let i=0;i<this.actionList.length;i++){
            for(let j=0;j<this.actionList.length-i-1;j++){
              if(this.actionList[j].time<this.actionList[j+1].time){
                let temp=this.actionList[j];
                this.actionList[j]=this.actionList[j+1];
                this.actionList[j+1]=temp;
              }
              else if(this.actionList[j].time==this.actionList[j+1].time){
                //时间相等的情况
                if(this.actionList[j].user==this.actionList[j+1].user&&this.actionList[j].operationId==this.actionList[j+1].operationId){
                  //将‘完成’放在最前，然后是‘开始，最后是被指派’
                  if(this.actionList[j].type=='开始'&&this.actionList[j+1].type=='完成'
                    ||this.actionList[j].type=='被指派'&&this.actionList[j+1].type=='完成'
                    ||this.actionList[j].type=='被指派'&&this.actionList[j+1].type=='开始'
                  ){
                    let temp=this.actionList[j];
                    this.actionList[j]=this.actionList[j+1];
                    this.actionList[j+1]=temp;
                  }
                }
              }
              else{

              }
            }
          }

          //给人员出现的最后一条数据，添加标记，可以让用户更清楚看到该人员处于什么状态
          let userList:string[]=[];
          for(let i=0;i<this.actionList.length;i++){
            if(i==0){
              userList.push(this.actionList[i].user);
              this.addStatus(this.actionList[i]);
            }
            else{
              let cc=0;
              for(let ul of userList){
                if(ul==this.actionList[i].user){

                  break;
                }
                else{
                  if(cc==userList.length-1){
                    //新的一名员工
                    userList.push(this.actionList[i].user);
                    this.addStatus(this.actionList[i]);
                  }
                }
                cc++;
              }
            }
          }
          this.isLoading=false;
          console.log(this.actionList);
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error)
        this.isLoading=true;
      }
    )
  }

  private weeks:string[]=[];
  private operationCounts:number[]=[];
  @ViewChild('chart')chart: ChartComponent;
  private getOperationWeekList(){
    this.weeks.splice(0,this.weeks.length);
    this.operationCounts.splice(0,this.operationCounts.length);
    let date=new Date();
    let time=date.getTime();
    this.totalService.getOperationListWeek(time).then(
      data=>{
        let result=this.apiResultService.result(data);
        let i=1;
        for(let r of result.data){
          this.weeks.push(r.weekname);
          this.operationCounts.push(r.count);
          i++;
        }
        console.log(this.weeks);
        console.log(this.operationCounts);
        this.chart.resize();
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }
  private months:string[]=[];
  private monthOperationCounts:number[]=[];
  @ViewChild('monthChart') monthChart: ChartComponent;
  private getOperationMonthList(){
    this.months.splice(0,this.months.length);
    this.monthOperationCounts.splice(0,this.monthOperationCounts.length);
    let date=new Date();
    let time=date.getTime();
    this.totalService.getOperationListMonth(time).then(
      data=>{
        let result=this.apiResultService.result(data);
        let i=1;
        for(let r of result.data){
          this.months.push(r.monthname);
          this.monthOperationCounts.push(r.count);
          i++;
        }
        console.log(this.months);
        console.log(this.monthOperationCounts);
        this.monthChart.resize();
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private tabChange($event){
    if($event.index==0){
      this.getOperationWeekList();
    }
    if($event.index==1){
      this.getOperationMonthList();
    }
  }

  private addStatus(obj){
    if(obj.type=='完成'){
      obj.status='end'
    }
    if(obj.type=='开始'){
      obj.status='start'
    }
    if(obj.type=='被指派'){
      obj.status='call'
    }
  }

  private refreshOperationList(){
    this.getOperationList();
  }
  private refreshActionList(){
    this.getActionList();
  }
  private refreshOperationWeekList(){
    this.getOperationWeekList();
  }
}
