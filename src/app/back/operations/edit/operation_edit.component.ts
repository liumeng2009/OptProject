import {Component,OnInit} from '@angular/core'
import {animation,animate,style,state,transition,trigger,keyframes} from '@angular/animations';
import {Router,ActivatedRoute,Params} from '@angular/router';

import {DialogService,DialogRef,DialogCloseResult,DialogResult} from '@progress/kendo-angular-dialog';
import {PageChangeEvent,GridDataResult} from '@progress/kendo-angular-grid';
import { PlotBand,Border,DashType,ValueAxisLabels,LegendLabels } from '@progress/kendo-angular-charts';

import {User} from '../../../bean/user'
import {OperationService} from "../operations.service";
import {ApiResultService} from "../../main/apiResult.service";
import {AjaxExceptionService} from "../../main/ajaxExceptionService";
import {OptConfig} from "../../../config/config";
import {BusinessContentService} from "../businessContents/businessContent.service";
import {EquipType} from "../../../bean/equipType";
import {WorkOrder} from "../../../bean/workOrder";
import {Order} from "../../../bean/order";
import {Position} from "../../../bean/position";
import {BusinessContent} from "../../../bean/businessContent";
import {EquipOp} from "../../../bean/equipOp";

@Component({
  selector:'operation_edit',
  templateUrl:'./operation_edit.component.html',
  styleUrls:['./operation_edit.component.scss'],
  animations: [ // 动画的内容
    trigger('pageChanged', [
      // state 控制不同的状态下对应的不同的样式
      state('in', style({ opacity:1, transform: 'translateX(0%)' })),
      // transition 控制状态到状态以什么样的方式来进行转换
      transition('void=>*', animate('600ms ease-in-out',keyframes([
        style({  opacity: 0, transform: 'translateX(-100%)' }),
        style({ opacity: 1, transform: 'translateX(0%)' })
      ]))),
      transition('*=>void', animate('300ms',keyframes([
        style({  opacity: 1, transform: 'translateX(-0%)' }),
        style({ opacity: 0, transform: 'translateX(-100%)' })
      ]))),
    ])
  ]
})

export class OperationEditComponent  implements OnInit {
  private operation:WorkOrder=new WorkOrder(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
    new Order(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null),new BusinessContent(null,'WORD',[],new EquipType(null,null,null),new EquipOp(null,null,null)));
  constructor(
    private operationService:OperationService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private dialogService:DialogService,
    private businessContentService:BusinessContentService
  ){
    console.log(this.operation);
  };

  ngOnInit(){
    this.getData();
    this.initEquipType();

    this.chart();
  }

  private equipTypeLoading:boolean=false;
  private equiptypes:EquipType[]=[];
  private initEquipType(){
    this.equiptypes.splice(0,this.equiptypes.length);
    this.equipTypeLoading=true;
    this.businessContentService.getType().then(
      data=>{
        this.equipTypeLoading=false;
        let result=this.apiResultService.result(data);
        if(result.status==0){
          //这里想多了，直接简单处理就很完美
          this.equiptypes=result.data;
          this.initEquipment(null);
        }
      },
      error=>{
        this.equipTypeLoading=false;
        this.ajaxExceptionService.simpleOp(error)
      }
    )
  }

  private equipmentLoading:boolean=false;
  private equipments:Position[]=[];
  private initEquipment(_type){
    this.equipments.splice(0,this.equipments.length);
    this.equipmentLoading=true;
    this.businessContentService.getEquipment(_type?_type:this.operation.businessContent.equipType.code).then(
      data=>{
        this.equipmentLoading=false;
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.equipments=result.data;
          if(_type){
            this.operation.businessContent.equipment=this.equipments[0].name;
            this.initEquipOp(this.operation.businessContent.equipType.code,this.operation.businessContent.equipment,true);
          }
          else{
            this.initEquipOp(this.operation.businessContent.equipType.code,this.operation.businessContent.equipment,false);
          }

          console.log(this.equipments);
        }
      },
      error=>{
        this.equipmentLoading=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private equipTypeChange($event){
    console.log($event);
    this.initEquipment($event.code);
  }

  private equipChange($event){
    console.log($event);
    this.initEquipOp(this.operation.businessContent.equipType.code,$event,true);
  }

  private equipOpLoading:boolean=false;
  private equipOps:EquipOp[]=[];
  private initEquipOp(type:string,equipment:string,_change:boolean){
    this.equipOpLoading=true;
    this.equipOps.splice(0,this.equipOps.length);
    let typeSelect=type?type:(this.equiptypes[0]?this.equiptypes[0].code:'');
    let equipmentSelect=equipment?equipment:(this.equipments[0]?this.equipments[0].value:'');
    this.businessContentService.getBusinessContentList(null,typeSelect,equipmentSelect).then(
      data=>{
        this.equipOpLoading=false;
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.equipOps=result.data;
          for(let i=0;i<this.equipOps.length;i++){
              this.equipOps[i].name=result.data[i].equipOp.name;
          }
          console.log(this.equipOps);
          if(_change){
            this.operation.businessContent=result.data[0];
          }
        }
      },
      error=>{
        this.equipOpLoading=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private getData(){
    this.route.params.subscribe((params: Params) =>{
      this.operationService.getOperation(params.id).then(
        data=>{
          let result=this.apiResultService.result(data);
          if(result&&result.status==0){
            this.operation=result.data;
          }
        }
      );
    })
  }

  private onSubmit(){
    console.log(this.operation);
  }
  /*
  private dataChats=[
    {value:20,color:'transparent'},{value:30,color:'transparent'},{value:40,color:'transparent'}
  ]

  private dataChats1=[
    {value:10,color:'#ccc'},{value:20,color:'#ccc'},{value:25,color:'#ccc'}
  ]

  private dataChats2=[
    {value:60,color:'red'},{value:60,color:'red'},{value:100,color:'red'}
  ]*/

  private dateChats=[

  ]

  private dateChats1=[

  ]

  private dateChats2=[

  ]
  private dateChats3=[

  ]

  public from: number = 0;
  public to: number =0;

  private createTime=new Date(2017,11,16,9,5,0,0);
  private zpTime=new Date(2017,11,16,9,25,0,0);
  private arriveTime=new Date(2017,11,16,9,40,0,0);
  private finishTime=new Date(2017,11,16,10,50,0,0);


  private startTimeStamp=0;
  //默认一个x轴的小间隔是10分钟
  private perTimeBox=10;
  private perTimeBoxStamp=10*60*1000;

  private chart(){
    let createTimeCh=new Date(2017,11,16,9,0,0,0);
    let finishTimeCh=new Date(2017,11,16,11,0,0,0);


    let createTimeChStamp=Date.parse(createTimeCh.toString());
    let finishTimeChStamp=Date.parse(finishTimeCh.toString());

    this.startTimeStamp=createTimeChStamp;


    let createTimeStamp=Date.parse(this.createTime.toString());
    let zpTimeStamp=Date.parse(this.zpTime.toString());
    let arriveTimeStamp=Date.parse(this.arriveTime.toString());
    let finishTimeStamp=Date.parse(this.finishTime.toString());

    console.log(finishTimeChStamp-createTimeChStamp);

    let max=finishTimeChStamp-createTimeChStamp;
    let seconds=max/1000;
    let minutes=seconds/60;


    while(minutes/this.perTimeBox<10){
      this.perTimeBox=this.perTimeBox*2;
    }

    this.perTimeBoxStamp=this.perTimeBox*60*1000;



    this.to=this.from+finishTimeChStamp-createTimeChStamp;

    this.dateChats.push({color:'transparent',value:createTimeStamp-createTimeChStamp})
    this.dateChats1.push({color:'#ddd',value:zpTimeStamp-createTimeStamp})
    this.dateChats2.push({color:'red',value:arriveTimeStamp-zpTimeStamp})
    this.dateChats3.push({color:'green',value:finishTimeStamp-arriveTimeStamp})

    console.log(this.dateChats);
    console.log(this.dateChats1);
    console.log(this.dateChats2);
    console.log(this.dateChats3);


  }


  private dash:DashType;

  private border:Border={
    color:'transparent',
    dashType:this.dash,
    width:0
  }

  private valueAxisLabel:ValueAxisLabels={
    content:(_value)=>
    {
      console.log(_value);
      let dt=new Date(this.startTimeStamp+_value.value);
      return dt.getHours()+':'+dt.getMinutes()
    },
  };

  private zhipai=(e)=>{

    console.log(e);
    let dt=new Date(this.startTimeStamp+e.stackValue);
    return dt.getHours()+'时'+dt.getMinutes()+'分指派'

  }

  private gongzuo=(e)=>{

    console.log(e);
    let dt=new Date(this.startTimeStamp+e.stackValue);
    return dt.getHours()+'时'+dt.getMinutes()+'分开始工作'

  }

  private jianli=(e)=>{

    console.log(e);
    let dt=new Date(this.startTimeStamp+e.stackValue);
    return dt.getHours()+'时'+dt.getMinutes()+'分建立工单'

  }



}
