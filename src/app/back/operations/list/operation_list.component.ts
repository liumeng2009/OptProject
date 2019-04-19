import {Component,OnInit} from '@angular/core'
import {animation,animate,style,state,transition,trigger,keyframes} from '@angular/animations';
import {Router,ActivatedRoute} from '@angular/router';

import {DialogService,DialogRef,DialogCloseResult,DialogResult} from '@progress/kendo-angular-dialog';
import {PageChangeEvent,GridDataResult} from '@progress/kendo-angular-grid';
import { filterBy, FilterDescriptor, CompositeFilterDescriptor } from '@progress/kendo-data-query';

import {User} from '../../../bean/user'
import {OperationService} from "../operations.service";
import {ApiResultService} from "../../main/apiResult.service";
import {AjaxExceptionService} from "../../main/ajaxExceptionService";
import {OptConfig} from "../../../config/config";
import {CorporationService} from "../../basicSettings/corporation/corporation.service";
import {SwitchService} from "../../main/switchService";
import {MissionService} from "../../main/mission.service";

@Component({
  selector:'operation_list',
  templateUrl:'./operation_list.component.html',
  styleUrls:['./operation_list.component.scss'],
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

export class OperationListComponent  implements OnInit {

  private gridData:GridDataResult = {
    data: [],
    total: 0
  };

  private height:number = 0;
  private pageSize:number = new OptConfig().pageSize;
  private skip:number = 0;
  private total:number = 0;
  private firstRecord:number = 0;
  private lastRecord:number = 0;
  private result;
  private isLoading:boolean = true;

  public filter: CompositeFilterDescriptor;
  private corps=[];
  private searchFilter={
    showTodayFilter:true,
    todayFilter:new Date(),
    corpFilter:'0',
    page:0,
    noFilter:''
  }
  private subscription;

  constructor(
    private operationService:OperationService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private dialogService:DialogService,
    private corporationService:CorporationService,
    private switchService:SwitchService,
    private missionService:MissionService
  ){

  };

  private pageAuths=[];
  private showAddBtn:boolean=false;
  private showListEditBtn:boolean=false;
  private showListDeleteBtn:boolean=false;
  ngOnInit(){
    this.height = (window.document.body.clientHeight - 70 - 56 - 50 - 20-27);
    this.auth();
    this.initFilter();
    this.getFilterCorpoationData();
    console.log(this.searchFilter);
    this.skip=this.searchFilter.page*this.pageSize;
    this.getData(this.searchFilter.page+1,this.searchFilter.showTodayFilter?this.searchFilter.todayFilter:null,this.searchFilter.corpFilter,this.searchFilter.noFilter);
  }
  //从user对象中，找出对应该页面的auths数组
  private auth(){
    let user=this.switchService.getUser();
    if(user){
      //main组件早已经加载完毕的情况
      this.pageAuths=this.initAuth('op');
      this.initComponentAuth();
    }
    else{
      //和main组件一同加载的情况
      this.subscription=this.missionService.hasAuth.subscribe(()=>{
        this.pageAuths=this.initAuth('op');
        this.initComponentAuth();
      });
    }
  }
  private initAuth(functioncode){
    let resultArray=[];
    let user=this.switchService.getUser();
    if(user&&user.role&&user.role.auths){
      let auths=user.role.auths;
      console.log(auths);
      for(let auth of auths){
        if(auth.opInFunc
          &&auth.opInFunc.function
          &&auth.opInFunc.function.code
          &&auth.opInFunc.function.code==functioncode
        ){
          resultArray.push(auth);
        }
      }
    }
    return resultArray;
  }
  //根据auth数组，判断页面一些可操作组件的可用/不可用状态
  private initComponentAuth(){
    for(let auth of this.pageAuths){
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='add'){
        this.showAddBtn=true;
      }
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='edit'){
        this.showListEditBtn=true;
      }
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='delete'){
        this.showListDeleteBtn=true;
      }
    }
  }

  private initFilter(){
    let create_time=this.switchService.getOperationListFilter('create_time');
    if(create_time&&create_time!=''){
      this.searchFilter.todayFilter=new Date(create_time.toString());
    }

    let corp=this.switchService.getOperationListFilter('corp');
    if(corp&&corp!=''){
      this.searchFilter.corpFilter=corp;
    }
    let no=this.switchService.getOperationListFilter('no');
    if(no&&no!=''){
      this.searchFilter.noFilter=no;
    }

    let show=this.switchService.getOperationListFilter('show_create_time');
    if(show){
      this.searchFilter.showTodayFilter=true;
    }
    else{
      this.searchFilter.showTodayFilter=false;
    }

    let page=this.switchService.getOperationListFilter('page');
    if(page){
      this.searchFilter.page=page;
    }


  }
  private getData(pageid,time,corp,no){
    let d;
    if(time){
      let dateSubmit=new Date(time.toString());
      d=dateSubmit.getTime();
    }
    console.log(d);
    this.operationService.getOperationList(pageid,d,corp,no)
      .then(
        data=> {
          console.log(data);
          if (this.apiResultService.result(data)) {
            this.gridData.data = this.apiResultService.result(data).data;
            this.total = this.gridData.total = this.apiResultService.result(data).total;
            this.firstRecord = this.skip + 1;
            this.lastRecord = this.apiResultService.result(data).data.length + this.skip;
            //如果actions.length>0 并且有一条action的operationComplete=1，则标志着，工单完结了。
            // complete==0 未处理 complete==1 处理中  complete==2 处理完成 complete=3 已指派
            for(let d of this.gridData.data){
              if(d.actions&&d.actions.length>0){
                if(d.complete){

                }
                else{
                  d.complete='3'
                }
                for(let i=0;i<d.actions.length;i++){
                  if(d.actions[i].start_time){
                    d.complete='1';
                  }
                  if(d.actions[i].operationComplete.toString()=='1'){
                    d.complete='2';
                    break;
                  }
                }
              }
              else{
                d.complete='0'
              }

              //哪些人参与了运维
              let nameArray=[];
              for(let act of d.actions){
                if(act.user&&act.user.name){
                  if(nameArray.length==0){
                    nameArray.push(act.user.name);
                  }
                  else{
                    let i=0;
                    for(let na of nameArray){
                      if(na==act.user.name){
                        break;
                      }
                      else{
                        if(i==nameArray.length-1){
                          nameArray.push(act.user.name);
                        }
                      }
                      i++;
                    }
                  }
                }
              }
              d.workers='';
              for(let na of nameArray){
                d.workers=d.workers+na+'  ';
              }

            }





          }
          this.isLoading = false;
          console.log(this.gridData.data);
        },
        error=> {
          this.ajaxExceptionService.simpleOp(error);
          this.isLoading = false;
        }
      );
  }
  private dateFilterChange($event){
    this.switchService.setOperationListFilter('create_time',$event);
    this.searchFilter.todayFilter=new Date($event);
    this.getData( 1,this.searchFilter.showTodayFilter?this.searchFilter.todayFilter:null,this.searchFilter.corpFilter,this.searchFilter.noFilter);
  }
  private handleCorpChange($event){
    this.searchFilter.corpFilter=$event.id;
    this.switchService.setOperationListFilter('corp',$event.id);
    this.getData( 1,this.searchFilter.showTodayFilter?this.searchFilter.todayFilter:null,this.searchFilter.corpFilter,this.searchFilter.noFilter);
  }
  private noFilterChange($event){
    let noSelect=$event.target.value;
    console.log(this.searchFilter);
    this.getData( 1,this.searchFilter.showTodayFilter?this.searchFilter.todayFilter:null,this.searchFilter.corpFilter,this.searchFilter.noFilter);
  }
  private refresh() {
    this.gridData.data = [];
    this.gridData.total = 0;
    this.isLoading = true;
    this.getData(this.skip / this.pageSize + 1,this.searchFilter.showTodayFilter?this.searchFilter.todayFilter:null,this.searchFilter.corpFilter,this.searchFilter.noFilter);
  }
  private getFilterCorpoationData(){
    this.corps.slice(0,this.corps.length);
    this.corporationService.getCorporationList(null,null).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.corps=result.data;
        }
        this.corps.unshift({name:'全部',id:'0'});
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }
  private searchDateChange($event){
    let bol=$event.target.checked;
    if(bol){
      this.searchFilter.showTodayFilter=true;
      this.switchService.setOperationListFilter('show_create_time',true);
      this.getData( 1,this.searchFilter.showTodayFilter?this.searchFilter.todayFilter:null,this.searchFilter.corpFilter,this.searchFilter.noFilter);
    }
    else{
      this.searchFilter.showTodayFilter=false;
      this.switchService.setOperationListFilter('show_create_time',false);
      this.getData( 1,this.searchFilter.showTodayFilter?this.searchFilter.todayFilter:null,this.searchFilter.corpFilter,this.searchFilter.noFilter);
    }

  }
  private editRow(id){
      this.router.navigate([id],{relativeTo:this.route.parent});
  }
  private deleteRow(id){
    let dialog=this.dialogService.open({
      title:'确认？',
      content:'确认要删除吗？',
      actions:[
        {text:'否'},
        {text:'是',primary:true}
      ]
    })
    dialog.result.subscribe((result)=>{
      if (result instanceof DialogCloseResult) {

      } else {

      }
      this.result = result;
      if(this.result.text=='是'){
        this.operationService.delete(id).then(
          data=>{
            let result=this.apiResultService.result(data);
            if(result&&result.status==0){
              this.getData(1,this.searchFilter.showTodayFilter?this.searchFilter.todayFilter:null,this.searchFilter.corpFilter,this.searchFilter.noFilter);
            }
          },
          error=>{
            this.ajaxExceptionService.simpleOp(error);
          }
        )
      }
      else{

      }
    })
  }
  private add(){
    this.router.navigate(['add'],{relativeTo:this.route.parent});
  }
  private pageChange(event,PageChangeEvent){
    this.skip=event.skip;
    this.isLoading=true;
    this.switchService.setOperationListFilter('page',this.skip/this.pageSize);
    this.getData(this.skip/this.pageSize+1,this.searchFilter.showTodayFilter?this.searchFilter.todayFilter:null,this.searchFilter.corpFilter,this.searchFilter.noFilter);
  }
  private print(id){
    //this.operationService.printOperation(id);
    window.open(new OptConfig().serverPath + '/page/operation/' + id);
  }
}
