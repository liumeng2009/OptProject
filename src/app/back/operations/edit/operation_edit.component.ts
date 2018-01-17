import {Component,OnInit,ViewChild,ElementRef,AfterViewInit,OnDestroy,TemplateRef} from '@angular/core'

import {animation,animate,style,state,transition,trigger,keyframes} from '@angular/animations';
import {Router,ActivatedRoute,Params} from '@angular/router';

import {DialogService,DialogRef,DialogCloseResult,DialogResult} from '@progress/kendo-angular-dialog';
import { Surface,SurfaceOptions } from '@progress/kendo-drawing';

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

import { drawProcess } from './drawProcess';
import {WorkerService} from "../../basicSettings/worker/worker.service";
import {LmTime} from "../../components/lmtimepicker/lmtime";
import {MissionService} from "../../main/mission.service";
import {SwitchService} from "../../main/switchService";

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

export class OperationEditComponent  implements OnInit,AfterViewInit,OnDestroy {
  private operation:WorkOrder=new WorkOrder(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
    new Order(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null),new BusinessContent(null,'WORD',[],new EquipType(null,null,null),new EquipOp(null,null,null)),true);
  constructor(
    private operationService:OperationService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private dialogService:DialogService,
    private businessContentService:BusinessContentService,
    private workerService:WorkerService,
    private missionService:MissionService,
    private switchService:SwitchService
  ){
    console.log(this.operation);
  };

  ngOnInit(){
    this.getData();
    this.initEquipType();

    this.initWorkers();

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
  private submitWorkOrder:WorkOrder=new WorkOrder('','',null,null,null,null,null,
    null,null,false,0,null,null,
    0,null,null,null,null,null,null,true,false,false,true,'',0,null,null,
    null,null,false
  );


  private isHiddenType:boolean=false;
  private isHiddenEquipment:boolean=false;
  private isHiddenOp:boolean=false;

  private isHiddenRemark:boolean=false;
  private isHiddenImportant:boolean=false;
  private getData(){
    this.route.params.subscribe((params: Params) =>{
      this.operationService.getOperation(params.id).then(
        data=>{
          let result=this.apiResultService.result(data);
          if(result&&result.status==0&&result.data){
            this.operation=result.data;
            console.log(data);
            console.log(result);
            //如果已经有行为了，就不能修改
/*            if(result.data.actions.length>0){
              this.isHiddenType=true;
              this.isHiddenEquipment=true;
              this.isHiddenOp=true;
              this.isHiddenRemark=true;
              this.isHiddenImportant=true;
            }*/



            //可以初始化submit了
            this.submitWorkOrder.id=params.id;
            let operation_create_time=result.data.create_time;
            let createTime=new Date(operation_create_time);
            //先把工单建立时间赋值给指派时间、开始时间和结束时间，作为初始值
            this.submitWorkOrder.call_date=createTime;
            this.submitWorkOrder.call_date_time=new LmTime(createTime.getHours(),createTime.getMinutes(),createTime.getSeconds());
            this.submitWorkOrder.arrive_date=createTime;
            this.submitWorkOrder.arrive_date_time=new LmTime(createTime.getHours(),createTime.getMinutes(),createTime.getSeconds());
            this.submitWorkOrder.finish_date=createTime;
            this.submitWorkOrder.finish_date_time=new LmTime(createTime.getHours(),createTime.getMinutes(),createTime.getSeconds());
            //把数据送到图表类，开始画图表
            let operationCreateTime=new Date(result.data.create_time);
            this.processData.createTime=operationCreateTime;

            //处理状态
            let d =result.data;
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


            if(result.data.actions){
              for(let i=0;i<result.data.actions.length;i++){
                let _action=result.data.actions[i];
                let obj={
                  id:_action.id,
                  worker:_action.user.name,
                  workerId:_action.user.id,
                  zpTime:_action.call_time?new Date(_action.call_time):null,
                  arriveTime:_action.start_time?new Date(_action.start_time):null,
                  finishTime:_action.end_time?new Date(_action.end_time):null,
                  operationFinish:_action.operationComplete?_action.operationComplete:false
                }
                this.processData.process.push(obj);
              }

              let processLength=this.processData.process.length;
              let per=150;

              let height=processLength*per<300?300:processLength*per;

              this.surfaceHeight.height=height+'px';
              setTimeout(()=>{
                drawProcess(this.createSurface(),this.processData,this);
              },500)


            }
          }
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
        }
      );
    })
  }

  //将actions  排序一下

  private actionId:string;
  private actionDetail={
    operationId:'',
    id:'',
    workerId:'',
    create_date:null,
    create_time:null,
    create_stamp:null,
    call_date:null,
    call_time:null,
    call_stamp:null,
    showArriveDate:false,
    start_date:null,
    start_time:null,
    start_stamp:null,
    showFinishDate:false,
    end_date:null,
    end_time:null,
    end_stamp:null,
    isCompleteOperation:false
  }

  @ViewChild('actionEditDeleteTemplate')actionEditDeleteRef: TemplateRef<any>;
  @ViewChild('actionDetailTemplate')actionDetailRef:TemplateRef<any>;
  private deleteActionIcon;
  private isHiddenDeleteAction:boolean=false;
  private editDeleteActionDialog;
  //对某个进程进行操作
  private test(id){
    this.route.params.subscribe((params: Params) =>{
      this.actionId=id;
      this.actionDetail.operationId=params.id;
      for(let i=0;i<this.processData.process.length;i++){
        if(id==this.processData.process[i].id){
          let _acc=this.processData.process[i];
          this.actionDetail.id=id;
          this.actionDetail.workerId=_acc.workerId;

          let _create=new Date(this.processData.createTime);
          this.actionDetail.create_date=_create;
          this.actionDetail.create_time=new LmTime(_create.getHours(),_create.getMinutes(),_create.getSeconds());

          let zp=new Date(_acc.zpTime);
          this.actionDetail.call_date=zp;
          this.actionDetail.call_time=new LmTime(zp.getHours(),zp.getMinutes(),zp.getSeconds());

          if(_acc.arriveTime){
            let arrive=new Date(_acc.arriveTime);
            this.actionDetail.showArriveDate=true;
            this.actionDetail.start_date=arrive;
            this.actionDetail.start_time=new LmTime(arrive.getHours(),arrive.getMinutes(),arrive.getSeconds());
          }
          else{
            this.actionDetail.showArriveDate=false;
            this.actionDetail.start_date=_create;
            this.actionDetail.start_time=new LmTime(_create.getHours(),_create.getMinutes(),_create.getSeconds());;
          }
          if(_acc.finishTime){
            let finish=new Date(_acc.finishTime);
            this.actionDetail.end_date=finish;
            this.actionDetail.showFinishDate=true;
            this.actionDetail.end_time=new LmTime(finish.getHours(),finish.getMinutes(),finish.getSeconds());
          }
          else{
            this.actionDetail.end_date=_create;
            this.actionDetail.showFinishDate=false;
            this.actionDetail.end_time=new LmTime(_create.getHours(),_create.getMinutes(),_create.getSeconds());;
          }

          if(_acc.operationFinish){
            this.actionDetail.isCompleteOperation=true;
          }
          else{
            this.actionDetail.isCompleteOperation=false;
          }
          break;
        }
      }

      this.editDeleteActionDialog=this.dialogService.open({
        title:'操作工作进程',
        content:this.actionDetailRef,
        actions:this.actionEditDeleteRef
      });
    })


  }

  private editArriveDateChange($event){
    this.actionDetail.start_date=new Date($event);
  }
  private editFinishDateChange($event){
    this.actionDetail.end_date=new Date($event);
  }
  private onEditArriveTimeChange($event){
    console.log($event);
    this.actionDetail.start_time=$event;
  }
  private onEditFinishTimeChange($event){
    console.log($event);
    this.actionDetail.end_time=$event;
  }
  private editFinishOperationCheckChanged($event,dataItem){
    if($event.target.checked){
      this.actionDetail.isCompleteOperation=true;
      this.actionDetail.showArriveDate=true;
      this.actionDetail.showFinishDate=true;
    }
    else{
      this.actionDetail.isCompleteOperation=false;
    }
  }

  private editStartCheckedChange($event){
    if($event.target.checked){
      this.actionDetail.showArriveDate=true;
    }
    else{
      this.actionDetail.showArriveDate=false;
      this.actionDetail.showFinishDate=false;
    }
  }
  private editFinishCheckedChange($event){
    if($event.target.checked){
      this.actionDetail.showArriveDate=true;
      this.actionDetail.showFinishDate=true;
    }
    else{
      this.actionDetail.showFinishDate=false;
    }

  }




  private cancelAction(){
    this.editDeleteActionDialog.close();
  }
  private saveActionIcon;
  private isHiddenSaveAction:boolean=false;
  private editAction(){
    this.saveActionIcon='k-icon k-i-loading';
    this.isHiddenSaveAction=true;
    //处理actionDetail对象
    let createDateNew=new Date(this.actionDetail.create_date);
    createDateNew.setHours(this.actionDetail.create_time.hour);
    createDateNew.setMinutes(this.actionDetail.create_time.minute);
    createDateNew.setSeconds(this.actionDetail.create_time.second);
    this.actionDetail.create_stamp=Date.parse(createDateNew.toString());

    let callDateNew=new Date(this.actionDetail.call_date);
    callDateNew.setHours(this.actionDetail.call_time.hour);
    callDateNew.setMinutes(this.actionDetail.call_time.minute);
    callDateNew.setSeconds(this.actionDetail.call_time.second);
    this.actionDetail.call_stamp=Date.parse(callDateNew.toString());

    let startDateNew=new Date(this.actionDetail.start_date);
    startDateNew.setHours(this.actionDetail.start_time.hour);
    startDateNew.setMinutes(this.actionDetail.start_time.minute);
    startDateNew.setSeconds(this.actionDetail.start_time.second);
    this.actionDetail.start_stamp=Date.parse(startDateNew.toString());

    let endDateNew=new Date(this.actionDetail.end_date);
    endDateNew.setHours(this.actionDetail.end_time.hour);
    endDateNew.setMinutes(this.actionDetail.end_time.minute);
    endDateNew.setSeconds(this.actionDetail.end_time.second);
    this.actionDetail.end_stamp=Date.parse(endDateNew.toString());

    //
    console.log(this.actionDetail);

    this.operationService.editAction(this.actionDetail).then(
      data=>{
        this.saveActionIcon='';
        this.isHiddenSaveAction=false;
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.editDeleteActionDialog.close();
          this.updateProcess();
        }
      },
      error=>{
        this.saveActionIcon='';
        this.isHiddenSaveAction=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }
  private confirmDialogResult;
  private deleteAction(){

    let confirmDialog=this.dialogService.open({
      title:'确认',
      content:'确认要删除吗？',
      actions:[
        {text:'是',primary:true},
        {text:'否'}
      ]
    })

    confirmDialog.result.subscribe((result) =>{
      this.confirmDialogResult=result;
      if(this.confirmDialogResult.text=='是'){
        this.deleteActionIcon='k-icon k-i-loading';
        this.isHiddenDeleteAction=true;
        this.operationService.deleteAction(this.actionId).then(
          data=>{
            this.deleteActionIcon='';
            this.isHiddenDeleteAction=false;
            let result=this.apiResultService.result(data);
            if(result&&result.status==0){
              this.editDeleteActionDialog.close();
              this.updateProcess();
            }
          },
          error=>{
            this.ajaxExceptionService.simpleOp(error);
            this.deleteActionIcon='';
            this.isHiddenDeleteAction=false;
          }
        )
      }
    })


  }

  private processData={
    createTime:new Date(2017,11,16,23,50,50,0),
    process:[
      /*      {
       worker:'袁绍',
       zpTime:new Date(2017,11,16,9,6,0,0),
       arriveTime:new Date(2017,11,16,9,12,0,0),
       finishTime:new Date(2017,11,16,10,50,0,0),
       operationFinish:true
       },
       {
       worker:'诸葛正我',
       zpTime:new Date(2017,11,16,9,20,0,0),
       arriveTime:new Date(2017,11,16,9,50,0,0),
       finishTime:null
       },
       {
       worker:'小岑岑',
       zpTime:new Date(2017,11,16,9,40,0,0),
       arriveTime:null,
       finishTime:null
       }*/
    ]
  }

  private onSubmit(){
    console.log(this.operation);
    this.operationService.edit(this.operation).then(
      data=>{
        let result=this.apiResultService.result(data);
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private dateChartNone=[

  ]

  private dateChartCreate=[

  ]

  private dateChartZhipai=[

  ]
  private dateChartWork=[

  ]
  private dateChartFinish=[

  ]

  public from: number = 0;
  public to: number =0;

  private createTime=new Date(2017,11,16,9,5,0,0);
  private zpTime=new Date(2017,11,16,9,6,0,0);
  private arriveTime=new Date(2017,11,16,9,12,0,0);
  private finishTime=new Date(2017,11,16,10,50,0,0);

  private createTimeL=new Date(2017,11,16,9,5,0,0);
  private zpTimeL=new Date(2017,11,16,10,5,0,0);
  private arriveTimeL=null;
  private finishTimeL=null;



  @ViewChild('surface')
  private surfaceElement: ElementRef;
  private surface: Surface;


  public ngOnDestroy() {
    if(this.surface)
      this.surface.destroy();
  }

  private surfaceHeight={height:'400px'};

  private createSurface(): Surface {
    // Obtain a reference to the native DOM element of the wrapper
    const element = this.surfaceElement.nativeElement;



    // Create a drawing surface
    this.surface = Surface.create(element);



    return this.surface;
  }

  private updateProcess(){
    this.surface.destroy();
    this.processData.process.splice(0,this.processData.process.length);
    this.route.params.subscribe((params: Params) =>{
      this.operationService.getOperation(params.id).then(
        data=>{
          let result=this.apiResultService.result(data);
          if(result&&result.status==0&&result.data){
            this.operation=result.data;
            //把数据送到图表类，开始画图表
            let operationCreateTime=new Date(result.data.create_time);
            this.processData.createTime=operationCreateTime;


            //处理状态
            let d =result.data;
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

            if(result.data.actions){
              for(let i=0;i<result.data.actions.length;i++){
                let _action=result.data.actions[i];
                let obj={
                  id:_action.id,
                  worker:_action.user.name,
                  workerId:_action.user.id,
                  zpTime:_action.call_time?new Date(_action.call_time):null,
                  arriveTime:_action.start_time?new Date(_action.start_time):null,
                  finishTime:_action.end_time?new Date(_action.end_time):null,
                  operationFinish:_action.operationComplete?_action.operationComplete:false
                }
                this.processData.process.push(obj);
              }

              let processLength=this.processData.process.length;
              let per=150;

              let height=processLength*per<300?300:processLength*per;

              this.surfaceHeight.height=height+'px';

            }
            setTimeout(()=>{
              drawProcess(this.createSurface(),this.processData,this);
            },200)

          }
        }
      );
    });
  }

  @ViewChild('itemListRef')tpl: TemplateRef<any>;
  @ViewChild('actionTemplate')actionTemplate: TemplateRef<any>;
  private dialog;
  private addProcess(){
    this.dialog=this.dialogService.open({
      title: "添加进度？",
      content: this.tpl,
      actions:this.actionTemplate
    });
  }

  ngAfterViewInit() {
    if(this.switchService.getActionAutoAdd()){
      //打开dialog
      this.dialog=this.dialogService.open({
        title: "添加进度？",
        content: this.tpl,
        actions:this.actionTemplate
      });
      this.switchService.setActionAutoAdd(false);
    }
  }

  private isSavingProcess:boolean=false;
  private savingProcessIcon='';
  private saveProcess(){
    //处理一下submit
    //处理calltime

    let call_time_Stamp_type_date=new Date(this.submitWorkOrder.call_date.getFullYear(),this.submitWorkOrder.call_date.getMonth(),
    this.submitWorkOrder.call_date.getDate(),this.submitWorkOrder.call_date_time.hour,this.submitWorkOrder.call_date_time.minute,
      this.submitWorkOrder.call_date_time.second,0);
    this.submitWorkOrder.call_date_timestamp=Date.parse(call_time_Stamp_type_date.toString());
    //处理arrivetime
    if(this.submitWorkOrder.showArriveDate&&this.submitWorkOrder.arrive_date!=null&&this.submitWorkOrder.arrive_date_time!=null){
      let arrive_time_Stamp_type_date=new Date(this.submitWorkOrder.arrive_date.getFullYear(),this.submitWorkOrder.arrive_date.getMonth(),
        this.submitWorkOrder.arrive_date.getDate(),this.submitWorkOrder.arrive_date_time.hour,this.submitWorkOrder.arrive_date_time.minute,
        this.submitWorkOrder.arrive_date_time.second,0);
      this.submitWorkOrder.arrive_date_timestamp=Date.parse(arrive_time_Stamp_type_date.toString());
    }
    //处理finishtime
    if(this.submitWorkOrder.showFinishDate&&this.submitWorkOrder.finish_date!=null&&this.submitWorkOrder.finish_date_time!=null){
      let finish_time_Stamp_type_date=new Date(this.submitWorkOrder.finish_date.getFullYear(),this.submitWorkOrder.finish_date.getMonth(),
        this.submitWorkOrder.finish_date.getDate(),this.submitWorkOrder.finish_date_time.hour,this.submitWorkOrder.finish_date_time.minute,
        this.submitWorkOrder.finish_date_time.second,0);
      this.submitWorkOrder.finish_date_timestamp=Date.parse(finish_time_Stamp_type_date.toString());
    }
    console.log(this.submitWorkOrder);
    this.isSavingProcess=true;
    this.savingProcessIcon='k-icon k-i-loading';
    this.operationService.createAction(this.submitWorkOrder).then(
      data=>{
        this.isSavingProcess=false;
        this.savingProcessIcon='';
        let result=this.apiResultService.result(data);
        //成功，更新图表
        if(result&&result.status==0){
          //drawProcess(this.createSurface(),this.processData,this);
          this.dialog.close();
          this.updateProcess();
        }
      },
      error=>{
        this.isSavingProcess=false;
        this.savingProcessIcon='';
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private cancelProcess(){
    this.dialog.close();
  }



  private workers:User[]=[];
  private isWorkerLoading:boolean=false;
  private initWorkers(){
    this.isWorkerLoading=true;
    this.workers.splice(0,this.workers.length);
    this.workerService.getWorkerList(null).then(
      data=>{
        this.isWorkerLoading=true;
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          for(let i=0;i<result.data.length;i++){
            if(result.data[i].worker){
              let user=result.data[i];
              this.workers.push(user);
            }
          }
          if(this.workers.length>0){
            this.submitWorkOrder.worker=this.workers[0].id;
          }
          this.isWorkerLoading=false;
        }
      },
      error=>{
        this.isWorkerLoading=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private workerChange($event){
    this.submitWorkOrder.worker=$event.id;
  }

  private callDateChange($event){
    console.log($event);
    this.submitWorkOrder.call_date=$event;
  }

  private arriveDateChange($event){
    console.log($event);
    this.submitWorkOrder.arrive_date=$event;
  }

  private finishDateChange($event){
    console.log($event);
    this.submitWorkOrder.finish_date=$event;
  }
  private onCallTimeChange($event){
    console.log($event);
    this.submitWorkOrder.call_date_time=$event;
  }
  private onArriveTimeChange($event){
    console.log($event);
    this.submitWorkOrder.arrive_date_time=$event;
    console.log(this.submitWorkOrder);
  }
  private onFinishTimeChange($event){
    console.log($event);
    this.submitWorkOrder.finish_date_time=$event;
  }
  private finishCheckedChange($event){
    console.log($event);
    if($event.target.checked){
      this.submitWorkOrder.showArriveDate=true;
      this.submitWorkOrder.isCompleteOperation=true;
    }
    else{
      this.submitWorkOrder.isCompleteOperation=false;
    }
  }

  private finishCheckChanged($event){
    if($event.target.checked){
      this.submitWorkOrder.showArriveDate=true;
      this.submitWorkOrder.showFinishDate=true;
    }
  }

}
