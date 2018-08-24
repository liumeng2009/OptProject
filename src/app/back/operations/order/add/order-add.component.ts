import {Component,OnInit,ViewContainerRef,TemplateRef,ViewChild} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import {CookieService} from 'angular2-cookie/core';

import {MissionService} from '../../../main/mission.service';

import {OrderService} from '../order.service';
import {GroupService} from '../../../basicSettings/group/group.service'

import {GridComponent} from '@progress/kendo-angular-grid';
import {DialogService,DialogRef,DialogCloseResult,DialogResult} from '@progress/kendo-angular-dialog';


import {AlertData} from "../../../../bean/alertData";

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';
import {Order} from "../../../../bean/order";
import {Position} from "../../../../bean/position";
import {Operation} from "../../../../bean/operation";
import {Group} from "../../../../bean/group";
import {CorporationService} from "../../../basicSettings/corporation/corporation.service";
import {Corporation} from "../../../../bean/corporation";
import {CorpBuilding} from "../../../../bean/corpBuilding";
import {CorpBuildingService} from "../../../basicSettings/corporation/corpBuilding.service";
import {EquipType} from "../../../../bean/equipType";
import {BusinessContentService} from "../../businessContents/businessContent.service";
import {Need} from "../../../../bean/need";
import {Equipment} from "../../../../bean/equipment";
import {EquipOp} from "../../../../bean/equipOp";
import {WorkOrder} from "../../../../bean/workOrder";
import {LmTime} from "../../../components/lmtimepicker/lmtime";
import {LmTimePicker} from "../../../components/lmtimepicker/lm-timepicker.component";
import {User} from "../../../../bean/user";
import {WorkerService} from "../../../basicSettings/worker/worker.service";
import {SwitchService} from "../../../main/switchService";
import {BusinessContent} from "../../../../bean/businessContent";

const formGroup = dataItem => new FormGroup({
  'type':new FormControl(dataItem.type),
  'equipment': new FormControl(dataItem.equipment),
  'op': new FormControl(dataItem.op),
  'no': new FormControl(dataItem.no)
});

@Component({
  selector:'order-add',
  templateUrl:'./order-add.component.html',
  styleUrls:['./order-add.component.scss']
})

export class OrderAddComponent implements OnInit{

  order=new Order(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
  groups:Group[]=[];
  public today: Date = new Date();

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private orderService:OrderService,
    private groupService:GroupService,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private missionService:MissionService,
    private corporationService:CorporationService,
    private corpBuildingService:CorpBuildingService,
    private workerService:WorkerService,
    private dialogService:DialogService,
    private businessContentService:BusinessContentService,
    private cookieService:CookieService,
    private switchService:SwitchService
  ){

  };

  private time=new LmTime(0,0,0);

  private workOrderGridHeight=0;

  ngOnInit(){
    this.workOrderGridHeight=(window.document.body.clientHeight - 70 - 56 -17);
    this.order.incoming_date=this.today.toDateString();
    this.initGroup();
    this.initTmpNeed();
    this.initWorkers();

    let date=new Date();
    this.time.hour=date.getHours();
    this.time.minute=date.getMinutes();
    this.time.second=date.getSeconds();

  }

  private groupLoading:boolean=false;
  private initGroup(){
    this.groupLoading=true;
    this.groupService.getGroupList(null).then(
      data=>{
        this.groupLoading=false;
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          for(let data of result.data){
            let group=new Group(data.id,data.name,null,data.status);
            this.groups.push(group);
          }
          this.order.group=this.groups[0]?this.groups[0].id:'';
          this.initCorporation();
        }
      },
      error=>{
        this.groupLoading=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }
  private corporations:Corporation[]=[];
  private corporationLoading:boolean=false;
  private initCorporation(){
    this.corporationLoading=true;
    this.corporations.splice(0,this.corporations.length);
    this.corporationService.getCorporationList(null,this.order.group).then(
      data=>{
        this.corporationLoading=false;
        let result=this.apiResultService.result(data);
        if(result.status==0){
          for(let data of result.data){
            let corp=new Corporation(data.id,data.name,data.description,data.group,data.status);
            this.corporations.push(corp);
          }
          if(this.corporations.length>0){
            this.order.corporation=new Corporation(this.corporations[0].id,this.corporations[0].name,this.corporations[0].description,this.corporations[0].group,this.corporations[0].status);
            this.initCorpBuilding();
          }
        }
      },
      error=>{
        this.corporationLoading=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private corpBuildings:CorpBuilding[]=[];
  private corpBuildingLoading:boolean=false;
  private initCorpBuilding(){
    this.corpBuildingLoading=true;
    this.corpBuildings.splice(0,this.corpBuildings.length);
    this.corpBuildingService.getCorporationList(this.order.corporation.id).then(
      data=>{
        this.corpBuildingLoading=false;
        let result=this.apiResultService.result(data);
        if(result.status==0){
          for(let d of result.data){
            switch(d.position){
              case 'E':
                d.position='东';
                break;
              case 'W':
                d.position='西';
                break;
              case 'S':
                d.position='南';
                break;
              case 'N':
                d.position='北';
                break;
              case 'A':
                d.position='全部';
                break;
              default:
                d.position='不明确'
            }

            let corpBuild=new CorpBuilding(d.id,d.corporationId,d.building,d.floor,d.position,d.status,(d.building?d.building.name:null)+d.floor+'层'+d.position);
            this.corpBuildings.push(corpBuild);
          }
          if(this.corpBuildings.length>0){
            this.order.custom_position=this.corpBuildings[0];
            console.log(this.order);
          }
        }
      },
      error=>{
        this.corpBuildingLoading=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private positionChange($event){
    for(let cb of this.corpBuildings){
      if(cb.id==$event){
        this.order.custom_position=cb;
        break;
      }
    }
  }

  private dateChange($event){
    this.today=$event;
    this.order.incoming_date=$event;
  }

  private workers:User[]=[];
  private initWorkers(){
    this.workers.splice(0,this.workers.length);
    this.workerService.getWorkerList(null).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          for(let i=0;i<result.data.length;i++){
            if(result.data[i].worker){
              let user=result.data[i];
              this.workers.push(user);
            }
          }
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private workerChange($event){

  }

  private ArriveDateShowChange($event){

  }

  @ViewChild('itemListRef')tpl: TemplateRef<any>;
  @ViewChild('itemQK')tplQK: TemplateRef<any>;
  @ViewChild('actionTemplate') actionTemplate: TemplateRef<any>;
  @ViewChild('actionQKTemplate') actionQKTemplate: TemplateRef<any>;

  @ViewChild('gridWorkerOrder') grid: GridComponent;

  private workerOrders:WorkOrder[]=[];
  private dialogQK;
  private dialog;
  private onOrderSubmit(){
    console.log(this.order);
    this.workerOrders.splice(0,this.workerOrders.length);
    this.order.needs=JSON.stringify(this.needs);
    let date=new Date(this.order.incoming_date);
    date.setHours(this.time.hour,this.time.minute,this.time.second,0);
    let lm=new LmTime(this.time.hour,this.time.minute,this.time.second);
    this.order.incoming_time=Date.parse(date.toString());

    //初始化快速分配工单时间模块
    this.qk.qk_call_date=date;
    this.qk.qk_call_time=new LmTime(date.getHours(),date.getMinutes(),date.getSeconds());
    this.qk.qk_start_date=date;
    this.qk.qk_start_time=new LmTime(date.getHours(),date.getMinutes(),date.getSeconds());
    this.qk.qk_end_date=date;
    let dateStamp=date.getTime();
    dateStamp+=1000*60*60;
    let dateAddOneHour=new Date(dateStamp);
    this.qk.qk_end_time=new LmTime(dateAddOneHour.getHours(),dateAddOneHour.getMinutes(),dateAddOneHour.getSeconds());

    this.dialogQK=this.dialogService.open({
      title: "需要快速分配工单时间吗？",
      content: this.tplQK,
      actions:this.actionQKTemplate
    });
  }
  private cancelQK(){
    this.qk.visible=false;
    this.dialogQK.close();
    console.log(this.qk);
    this.openWorkerOrderGrid()
  }
  private okQK(){
    this.qk.visible=true;
    console.log(this.qk);
    this.dialogQK.close();
    this.openWorkerOrderGrid()
  }

  private openWorkerOrderGrid(){
    console.log(this.order);
    this.workerOrders.splice(0,this.workerOrders.length);
    this.order.needs=JSON.stringify(this.needs);
    let date=new Date(this.order.incoming_date);
    date.setHours(this.time.hour,this.time.minute,this.time.second,0);
    let lm=new LmTime(this.time.hour,this.time.minute,this.time.second);
    this.order.incoming_time=Date.parse(date.toString());
    if(this.qk.visible){
      //需要自动生成各工单的时间轴
      //根据qk对象，计算所有工单的时间轴
      let needsLength=0;
      for(let i=0;i<this.needs.length;i++){
        for(let j=0;j<this.needs[i].no;j++){
          needsLength++;
        }
      }

      let qkCall=new Date(this.qk.qk_call_date.getFullYear(),this.qk.qk_call_date.getMonth(),this.qk.qk_call_date.getDate());
      qkCall.setHours(this.qk.qk_call_time.hour);
      qkCall.setMinutes(this.qk.qk_call_time.minute);
      qkCall.setSeconds(this.qk.qk_call_time.second);

      let qkStart=new Date(this.qk.qk_start_date.getFullYear(),this.qk.qk_start_date.getMonth(),this.qk.qk_start_date.getDate());
      qkStart.setHours(this.qk.qk_start_time.hour);
      qkStart.setMinutes(this.qk.qk_start_time.minute);
      qkStart.setSeconds(this.qk.qk_start_time.second);

      let qkEnd=new Date(this.qk.qk_end_date.getFullYear(),this.qk.qk_end_date.getMonth(),this.qk.qk_end_date.getDate());
      qkEnd.setHours(this.qk.qk_end_time.hour);
      qkEnd.setMinutes(this.qk.qk_end_time.minute);
      qkEnd.setSeconds(this.qk.qk_end_time.second);


      let restStart=new Date(this.qk.qk_start_date.getFullYear(),this.qk.qk_start_date.getMonth(),this.qk.qk_start_date.getDate());
      restStart.setHours(this.qk.rest_start_time.hour);
      restStart.setMinutes(this.qk.rest_start_time.minute);
      restStart.setSeconds(this.qk.rest_start_time.second);

      let restEnd=new Date(this.qk.qk_start_date.getFullYear(),this.qk.qk_start_date.getMonth(),this.qk.qk_start_date.getDate());
      restEnd.setHours(this.qk.rest_end_time.hour);
      restEnd.setMinutes(this.qk.rest_end_time.minute);
      restEnd.setSeconds(this.qk.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      rest_end_time.second);

      let qkCallStamp=qkCall.getTime();
      let qkStartStamp=qkStart.getTime();
      let qkEndStamp=qkEnd.getTime();
      let restStartStamp=restStart.getTime();
      let restEndStamp=restEnd.getTime();
      //如果这段时间中间没有经过中午休息时间
      if(qkEndStamp<restStartStamp||qkStartStamp>restEndStamp){
        let allStamp=qkEndStamp-qkStartStamp;
        let perStamp=allStamp/needsLength;

        let startIndex=0;
        for(let need of this.needs){
          for(let i=0;i<need.no;i++){

            let loopCallStamp=qkCallStamp;
            let loopCallDate=new Date(loopCallStamp);
            let loopCallTime=new LmTime(loopCallDate.getHours(),loopCallDate.getMinutes(),loopCallDate.getSeconds());

            let loopStartStamp=qkStartStamp+startIndex*perStamp;
            let loopStartDate=new Date(loopStartStamp);
            let loopStartTime=new LmTime(loopStartDate.getHours(),loopStartDate.getMinutes(),loopStartDate.getSeconds());

            let loopEndStamp=loopStartStamp+perStamp-60*1000;
            let loopEndDate=new Date(loopEndStamp);
            let loopEndTime=new LmTime(loopEndDate.getHours(),loopEndDate.getMinutes(),loopEndDate.getSeconds());


            let workOrder=new WorkOrder('','',this.order.custom_name,this.order.custom_phone,this.order.incoming_time,date,lm,
              this.order.custom_position,this.order.corporation,false,loopStartStamp,loopStartDate,loopStartTime,
              loopEndStamp,loopEndDate,loopEndTime,this.workers.length>0?this.workers[0].id:'',need.type,need.equipment,need.op,true,true,true,true,'',loopCallStamp,loopCallDate,loopCallTime,
              null,null,true
            );
            this.workerOrders.push(workOrder);

            startIndex++;
          }
        }

      }
      else{
        //中间跨越了休息时间
        let allStamp=qkEndStamp-qkStartStamp-(restEndStamp-restStartStamp);
        let amStamp=restStartStamp-qkStartStamp;
        let pmStamp=qkEndStamp-restEndStamp;

        let maxPerStamp=this.calMaxPerStamp(allStamp,amStamp,pmStamp,needsLength);

        let amCount=amStamp/maxPerStamp;
        let pmCount=pmStamp/maxPerStamp;

        let amIndex=0;
        let pmIndex=0;
        for(let need of this.needs){
          for(let i=0;i<need.no;i++){
            if(amIndex<amCount-1){
              let loopCallStamp=qkCallStamp;
              let loopCallDate=new Date(loopCallStamp);
              let loopCallTime=new LmTime(loopCallDate.getHours(),loopCallDate.getMinutes(),loopCallDate.getSeconds());

              let loopStartStamp=qkStartStamp+amIndex*maxPerStamp;
              let loopStartDate=new Date(loopStartStamp);
              let loopStartTime=new LmTime(loopStartDate.getHours(),loopStartDate.getMinutes(),loopStartDate.getSeconds());

              let loopEndStamp=loopStartStamp+maxPerStamp-60*1000;
              let loopEndDate=new Date(loopEndStamp);
              let loopEndTime=new LmTime(loopEndDate.getHours(),loopEndDate.getMinutes(),loopEndDate.getSeconds());


              let workOrder=new WorkOrder('','',this.order.custom_name,this.order.custom_phone,this.order.incoming_time,date,lm,
                this.order.custom_position,this.order.corporation,false,loopStartStamp,loopStartDate,loopStartTime,
                loopEndStamp,loopEndDate,loopEndTime,this.workers.length>0?this.workers[0].id:'',need.type,need.equipment,need.op,true,true,true,true,'',loopCallStamp,loopCallDate,loopCallTime,
                null,null,true
              );
              this.workerOrders.push(workOrder);
              amIndex++;
            }
            else{
              let loopCallStamp=qkCallStamp;
              let loopCallDate=new Date(loopCallStamp);
              let loopCallTime=new LmTime(loopCallDate.getHours(),loopCallDate.getMinutes(),loopCallDate.getSeconds());

              let loopStartStamp=restEndStamp+pmIndex*maxPerStamp;
              let loopStartDate=new Date(loopStartStamp);
              let loopStartTime=new LmTime(loopStartDate.getHours(),loopStartDate.getMinutes(),loopStartDate.getSeconds());

              let loopEndStamp=loopStartStamp+maxPerStamp-60*1000;
              let loopEndDate=new Date(loopEndStamp);
              let loopEndTime=new LmTime(loopEndDate.getHours(),loopEndDate.getMinutes(),loopEndDate.getSeconds());


              let workOrder=new WorkOrder('','',this.order.custom_name,this.order.custom_phone,this.order.incoming_time,date,lm,
                this.order.custom_position,this.order.corporation,false,loopStartStamp,loopStartDate,loopStartTime,
                loopEndStamp,loopEndDate,loopEndTime,this.workers.length>0?this.workers[0].id:'',need.type,need.equipment,need.op,true,true,true,true,'',loopCallStamp,loopCallDate,loopCallTime,
                null,null,true
              );
              this.workerOrders.push(workOrder);
              pmIndex++;
            }
          }
        }
      }
    }
    else{
      for(let need of this.needs){
        for(let i=0;i<need.no;i++){
          let workOrder=new WorkOrder('','',this.order.custom_name,this.order.custom_phone,this.order.incoming_time,date,lm,
            this.order.custom_position,this.order.corporation,false,0,date,new LmTime(date.getHours(),date.getMinutes(),date.getSeconds()),
            0,date,new LmTime(date.getHours(),date.getMinutes(),date.getSeconds()),this.workers.length>0?this.workers[0].id:'',need.type,need.equipment,need.op,true,false,false,false,'',0,date,new LmTime(date.getHours(),date.getMinutes(),date.getSeconds()),
            null,null,true
          );
          this.workerOrders.push(workOrder);
        }
      }
    }



    this.dialog=this.dialogService.open({
      title: "需要快速添加工单吗？",
      content: this.tpl,
      actions:this.actionTemplate
    });

    console.log(this.workerOrders);

    setTimeout(()=>{
      for(let i=0;i<this.workerOrders.length;i++)
        this.grid.expandRow(i);
    },0);
  }

  private calMaxPerStamp(allStamp,amStamp,pmStamp,count){
    let initPerStamp=allStamp/count;
    while(amStamp/initPerStamp+pmStamp/initPerStamp<count){
      initPerStamp=initPerStamp-60*1000;
    }
    return initPerStamp;
  }

  private cancel(){
    this.dialog.close();
  }

  private no(){
    this.saveOrder();
  }
  private SaveOrderAllLoading:string='';
  private isHiddenSaveOrderAllButton:boolean=false;
  private SaveOrderLoading:string='';
  private isHiddenSaveOrderButton:boolean=false;
    private yes(){
      this.saveOrderAll();
    }

  private saveOrder(){
    this.SaveOrderLoading='k-icon k-i-loading';
    this.isHiddenSaveOrderButton=true;
    this.isHiddenSaveOrderAllButton=true;
    this.orderService.create(this.order).then(
       data=>{
         this.SaveOrderLoading='';
         this.isHiddenSaveOrderButton=false;
         this.isHiddenSaveOrderAllButton=false;
         let result=this.apiResultService.result(data);
         if(result&&result.status==0){
           this.dialog.close();
           this.router.navigate(['../'],{relativeTo:this.route}).then(()=>{
             //保存成功之后，就把needs的缓存删除掉
             this.cookieService.remove('tmpneed');
             this.needs.splice(0,this.needs.length);
             this.switchService.setOrderListFilter('create_time',this.order.incoming_date.toString())
           });
         }
       },
       error=>{
       this.SaveOrderLoading='';
       this.isHiddenSaveOrderButton=false;
       this.isHiddenSaveOrderAllButton=false;
        this.ajaxExceptionService.simpleOp(error);
       }
    )

    setTimeout(()=>{
      this.SaveOrderLoading='';
      this.isHiddenSaveOrderButton=false;
      this.isHiddenSaveOrderAllButton=false;
    },10000);

  }
  private saveOrderAll(){
    console.log(this.order);
    this.SaveOrderAllLoading='k-icon k-i-loading';
    this.isHiddenSaveOrderAllButton=true;
    this.isHiddenSaveOrderButton=true;
    //规整对象数组
    for(let workerOrder of this.workerOrders){
      let _call=workerOrder.call_date;
      _call.setHours(workerOrder.call_date_time.hour,workerOrder.call_date_time.minute,workerOrder.call_date_time.second);
      workerOrder.call_date_timestamp=Date.parse(_call.toString());

      let _arrive=workerOrder.arrive_date;
      _arrive.setHours(workerOrder.arrive_date_time.hour,workerOrder.arrive_date_time.minute,workerOrder.arrive_date_time.second);
      workerOrder.arrive_date_timestamp=Date.parse(_arrive.toString());

      let _finish=workerOrder.finish_date;
      _finish.setHours(workerOrder.finish_date_time.hour,workerOrder.finish_date_time.minute,workerOrder.finish_date_time.second);
      workerOrder.finish_date_timestamp=Date.parse(_finish.toString());

    }

    this.order.workerOrders=this.workerOrders;

    this.orderService.createOperation(this.order).then(
      data=>{
        this.SaveOrderAllLoading='';
        this.isHiddenSaveOrderAllButton=false;
        this.isHiddenSaveOrderButton=false;
        if(data.status==80001){
          this.initWorkers();
        }
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.router.navigate(['../'],{relativeTo:this.route}).then(()=>{
            //保存成功之后，就把needs的缓存删除掉
            this.cookieService.remove('tmpneed');
            this.needs.splice(0,this.needs.length);
            this.switchService.setOrderListFilter('create_time',this.order.incoming_date.toString())
          });
          this.dialog.close();
        }
      },
      error=>{
        this.SaveOrderAllLoading='';
        this.isHiddenSaveOrderAllButton=false;
        this.isHiddenSaveOrderButton=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private clearTmpCookie(){

    let dialogTmp=this.dialogService.open({
      title: "请确认？",
      content: '确定要删除建立好的客户需求内容吗？',
      actions:[
        { text: "否" },
        { text: "是", primary: true }
      ]
    });

    dialogTmp.result.subscribe((result) => {

      if (result instanceof DialogCloseResult) {

      } else {

      }
      this.result = result;
      if(this.result.text=='是'){
        this.needs.splice(0,this.needs.length);
        this.cookieService.remove('tmpneed');
      }
    });
  }

  private equipTypeLoading:boolean=false;
  private equiptypes:EquipType[]=[];
  private equipTypeAdd:EquipType=new EquipType(null,null,null);
  private initEquipType(){
    this.equiptypes.splice(0,this.equiptypes.length);
    this.equipTypeLoading=true;
    this.businessContentService.getType().then(
      data=>{
        this.equipTypeLoading=false;
        let result=this.apiResultService.result(data);
        if(result.status==0){
          for(let d of result.data){
            let equiptype=new EquipType(d.id,d.name,d.code);
            this.equiptypes.push(equiptype);
          }
          if(this.equiptypes.length>0){
            if(this.formGroup){
              this.formGroup.patchValue({'type':this.equiptypes[0]});
            }
            this.initEquipment(this.equiptypes[0].code);
          }

        }
      },
      error=>{
        this.equipTypeLoading=false;
        this.ajaxExceptionService.simpleOp(error)
      }
    )
  }
  private equipmentLoading:boolean=false;
  private equipments:Equipment[]=[];
  private initEquipment(type:string){
    this.equipments.splice(0,this.equipments.length);
    this.equipmentLoading=true;
    if(this.equiptypes.length>0) {
      let typeSelect = type ? type : this.equiptypes[0].code;
      this.businessContentService.getEquipment(typeSelect).then(
        data=>{
          this.equipmentLoading=false;;
          let result=this.apiResultService.result(data);
          if(result&&result.status==0){
            for(let d of result.data){
              let equipment=new Equipment(d.equipment,d.equipment);
              this.equipments.push(equipment);
            }
            if(this.equipments.length>0){
              this.initEquipOp(typeSelect,this.equipments[0].value);
              if(this.formGroup){
                this.formGroup.patchValue({'equipment':this.equipments[0]});
              }
            }
          }
        },
        error=>{
          this.equipmentLoading=false;
          this.ajaxExceptionService.simpleOp(error);
        }
      );
    }
  }


  private equipOpLoading:boolean=false;
  private equipOps:EquipOp[]=[];
  private initEquipOp(type:string,equipment:string){
    this.equipOpLoading=true;
    this.equipOps.splice(0,this.equipOps.length);
    let typeSelect=type?type:(this.equiptypes[0]?this.equiptypes[0].code:'');
    let equipmentSelect=equipment?equipment:(this.equipments[0]?this.equipments[0].value:'');
    this.businessContentService.getBusinessContentList(null,typeSelect,equipmentSelect).then(
      data=>{
        this.equipOpLoading=false;
        let result=this.apiResultService.result(data);
        console.log(result);
        if(result&&result.status==0){
          for(let d of result.data){
            let equipOp=new EquipOp(d.id,d.equipOp?(d.isAdvanced?(d.equipOp.name+'(系统级)'):(d.equipOp.name)):'',d.operation);
            this.equipOps.push(equipOp);
          }
          if(this.equipOps.length>0){
            //this.initEquipOp(typeSelect,this.equipments[0].value);
            if(this.formGroup){
              this.formGroup.patchValue({'op':this.equipOps[0]});
            }
          }
        }
      },
      error=>{
        this.equipOpLoading=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private equipTypeChange($event){
    let typeSelect=$event.code;
    this.initEquipment(typeSelect);
  }

  private equipChange($event){
    this.initEquipOp(this.formGroup.value.type.code,$event.value);
  }


  private formGroup: FormGroup;
  private editedRowIndex:number;
  private needs:Need[]=[];

  private myAddRow(grid){
    grid.addRow(this.formGroup);
  }
  protected addHandler({sender}) {
    this.closeEditor(sender);
    //初始化三个下拉菜单
    this.initEquipType();


    this.formGroup =formGroup({
      'type':this.equiptypes[0]?this.equiptypes[0]:'',
      'equipment': this.equipments[0]?this.equipments[0]:'',
      'op': this.equipOps[0]?this.equipOps[0]:'',
      'no':1
    });
    sender.addRow(this.formGroup);
  }

  protected editHandler({sender, rowIndex, dataItem}) {
    this.closeEditor(sender);
    //初始化三个下拉菜单
    this.initEquipType();

    this.formGroup = formGroup({
      'type':dataItem.type,
      'equipment': dataItem.equipment,
      'op': dataItem.op,
      'no':dataItem.no
    });
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex,this.formGroup);
  }

  protected cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  protected saveHandler({sender, rowIndex, formGroup, isNew}) {
    const product = formGroup.value;
    if(isNew){
      if(this.needs.length==0){
        this.needs.push(product);
      }
      else{
        //重复的需求，数量相加
        let i=0;
        for(let n of this.needs){
          if(n.op.id==product.op.id){
            n.no=n.no+product.no;
            break;
          }
          if(i==this.needs.length-1){
            this.needs.push(product);
            break;
          }
          i++;
        }
      }


    }
    else{
      this.needs.splice(rowIndex,1);
      this.needs.push(product);
    }
    this.closeEditor(sender,rowIndex);
    this.saveTmpNeed();
  }
  //将最近的一次
  protected saveTmpNeed(){
    let date=new Date();
    date.setDate(date.getDate()+999);
    this.cookieService.put('tmpneed',''+JSON.stringify(this.needs)+'',{expires:date});
  }

  protected initTmpNeed(){
    let tmp=this.cookieService.get('tmpneed');
    if(tmp&&tmp!='')
      this.needs=JSON.parse(this.cookieService.get('tmpneed'));
  }

  private result;
  protected removeHandler({dataItem}) {
    const dialog: DialogRef = this.dialogService.open({
      title: "确认删除？",
      content: "确定删除吗？",
      actions: [
        { text: "否" },
        { text: "是", primary: true }
      ]
    });

    dialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {

      } else {

      }
      this.result = result;
      if(this.result.text=='是'){
        console.log(dataItem);
        let id=dataItem.op.id;
        let i=0;
        for(let ns of this.needs){
          if(ns.op.id==id){
            this.needs.splice(i,1);
            break;
          }
          i++;
        }
        console.log(this.needs)
        this.saveTmpNeed();;
      }
    });
  }

  private onTimeChange($event){
    this.time=$event;
  }

  private onArriveDateTimeChange($event){

  }

  private onFinishDateTimeChange($event){

  }
  private onCallDateTimeChange($event){

  }

  private finishCheckChanged($event,rowData){
    if($event.target.checked){
      //说明没有工程师，就不能点选。
      if(this.workers.length==0){
        this.missionService.change.emit(new AlertData('danger','没有设置工程师信息'));
        rowData.showArriveDate=false;
        rowData.showFinishDate=false;
        rowData.showWorker=false;
        $event.target.checked=false;
      }
      else{
        rowData.showArriveDate=true;
        rowData.showWorker=true;
      }

    }
  }
  private arriveCheckChanged($event,rowData){
    if($event.target.checked){
      if(this.workers.length==0){
        this.missionService.change.emit(new AlertData('danger','没有设置工程师信息'));
        rowData.showArriveDate=false;
        rowData.showFinishDate=false;
        rowData.showWorker=false;
        $event.target.checked=false;
      }
      else{
        rowData.showWorker=true;
      }

    }
    else{
      rowData.showFinishDate=false;
      rowData.showWorker=false;
    }
  }
  private workerCheckChanged($event,rowData){
    if($event.target.checked){
      if(this.workers.length==0){
        this.missionService.change.emit(new AlertData('danger','没有设置工程师信息'));
        rowData.showArriveDate=false;
        rowData.showFinishDate=false;
        rowData.showWorker=false;
        $event.target.checked=false;
      }
      else{
        //rowData.showArriveDate=true;
      }

    }
    else{
      rowData.showArriveDate=false;
      rowData.showFinishDate=false;
    }
  }

  //快速分配工单时间模块
  private qk={
    visible:false,
    qk_call_date:new Date(),
    qk_call_time:new LmTime(0,0,0),
    qk_start_date:new Date(),
    qk_start_time:new LmTime(0,0,0),
    qk_end_date:new Date(),
    qk_end_time:new LmTime(0,0,0),
    rest_start_time:new LmTime(12,0,0),
    rest_end_time:new LmTime(13,30,0)
  }




}
