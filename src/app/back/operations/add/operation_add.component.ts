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
import {OrderService} from "../order/order.service";
import {SwitchService} from "../../main/switchService";

@Component({
  selector:'operation_add',
  templateUrl:'./operation_add.component.html',
  styleUrls:['./operation_add.component.scss'],
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

export class OperationAddComponent  implements OnInit,OnDestroy {
  private now:Date=new Date();
  private operation:WorkOrder=new WorkOrder(null,null,null,null,null,this.now,new LmTime(this.now.getHours(),this.now.getMinutes(),this.now.getSeconds()),null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
    new Order(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null),new BusinessContent(null,'WORD',[],new EquipType(null,null,null),new EquipOp(null,null,null)),true);
  constructor(
    private operationService:OperationService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private dialogService:DialogService,
    private businessContentService:BusinessContentService,
    private orderService:OrderService,
    private switchService:SwitchService
  ){

  };
  private surfaceHeight={height:'400px'};
  @ViewChild('surface')
  private surfaceElement: ElementRef;
  private surface: Surface;
  private processData={
    createTime:new Date(2017,11,16,23,50,50,0),
    process:[

    ]
  }
  public ngOnDestroy() {
    if(this.surface)
      this.surface.destroy();
  }

  private createSurface(): Surface {
    // Obtain a reference to the native DOM element of the wrapper
    const element = this.surfaceElement.nativeElement;



    // Create a drawing surface
    this.surface = Surface.create(element);



    return this.surface;
  }
  ngOnInit(){
    this.route.params.subscribe((params: Params) => {
      if(params.orderid){
        this.getOrder(params.orderid,()=>{
          this.initEquipType();
          this.initOrder();
        });
      }
      else{
        this.initEquipType();
        this.initOrder();
      }
    })
  }

  private orderSelectDate:Date=new Date();
  private orders:Order[]=[];
  private orderObj={
    orderId:'1'
  };
  private initOrder(){
    let param=Date.parse(this.orderSelectDate.toDateString());
    this.getData(0,param);
  }

  private getOrder(orderid,callback){
    this.orderService.getOrder(orderid).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.orderObj.orderId=result.data.id;
          this.orderSelectDate=new Date();
          this.orderSelectDate.setTime(result.data.incoming_time);

          this.processData.createTime=new Date();
          this.processData.createTime.setTime(result.data.incoming_time);

          callback();
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private getData(page,time){
    this.orders.splice(0,this.orders.length);
    this.orderService.getOrderList(page,time).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.orders=result.data;
          if(result.data.length==0){
            //说明没有
            let o=new Order('1','今日暂无订单','',null,null,null,null,null,null,null,null,null,null,null,null,null);
            this.orders.push(o);
            this.isSubmitDisabled=true;
            this.processData.createTime=new Date();
            this.orderObj.orderId='1';
          }else{
            this.isSubmitDisabled=false;
            if(!this.orderObj.orderId||this.orderObj.orderId=='1'){
              this.orderObj.orderId=result.data[0].id;
            }
            else{

            }

            this.operation.order=result.data[0].id;
            this.processData.createTime=new Date();
            this.processData.createTime.setTime(result.data[0].incoming_time);

            let da=new Date();
            da.setTime(result.data[0].incoming_time);
            this.operation.incoming_date=da;
            this.operation.incoming_date_time=new LmTime(da.getHours(),da.getMinutes(),da.getSeconds());


            //细化no列，让用户看到更多的信息
            for(let i=0;i<result.data.length;i++){
              let newNo=result.data[i].no+' '+result.data[i].custom_name+' '+result.data[i].custom_phone+' '+result.data[i].corporation.name+' '
                +result.data[i].corpBuilding.building.name+' '+result.data[i].corpBuilding.floor+'楼 ';
              let position='';
              switch(result.data[i].corpBuilding.position){
                case 'E':
                  position='东';
                  break;
                case 'S':
                  position='南';
                  break;
                case 'W':
                  position='西';
                  break;
                case 'N':
                  position='北';
                  break;
                case 'A':
                  position='全部';
                  break;
                default:
                  position='全部';
              }
              newNo=newNo+position;
              result.data[i].no=newNo;
            }
          }

          let height=300

          this.surfaceHeight.height=height+'px';
          setTimeout(()=>{
            drawProcess(this.createSurface(),this.processData,this);
          },500)

        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private isSubmitDisabled:boolean=true;
  private OrderIncomingDateChange($event){
    let dateStamp=Date.parse($event);
    this.getData(0,dateStamp);
  }

  private orderSelect($event){
    console.log($event);
    this.operation.order=$event;
  }

  private onOperationCreateTimeChange($event){
    this.operation.incoming_date_time=$event;
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
          if(result.data.length>0){
            this.equiptypes=result.data;
            this.operation.businessContent.equipType.id=result.data[0].id;
            this.initEquipment(result.data[0].code);
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

  private onSubmit(){
    console.log(this.operation);
    let date=new Date(this.operation.incoming_date.toString());
    date.setHours(this.operation.incoming_date_time.hour,this.operation.incoming_date_time.minute,this.operation.incoming_date_time.second,0);

    this.operation.incoming_date_timestamp=Date.parse(date.toString());

    this.operationService.create(this.operation).then(
      data=>{
        let result=this.apiResultService.result(data);
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private addProcess(){
    //保存后，跳转到edit页面
    console.log(this.operation);
    let date=new Date(this.operation.incoming_date.toString());
    date.setHours(this.operation.incoming_date_time.hour,this.operation.incoming_date_time.minute,this.operation.incoming_date_time.second,0);

    this.operation.incoming_date_timestamp=Date.parse(date.toString());
    this.operation.important=this.operation.important?this.operation.important:false;
    this.operationService.create(this.operation).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.router.navigate(['./'+data.data.id],{relativeTo:this.route.parent}).then(()=>{
            this.switchService.setActionAutoAdd(true);
          });
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )

  }
}
