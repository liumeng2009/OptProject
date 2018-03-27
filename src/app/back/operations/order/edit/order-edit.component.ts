import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import {DialogService,DialogRef,DialogCloseResult,DialogResult} from '@progress/kendo-angular-dialog';

import {MissionService} from '../../../main/mission.service';

import {OrderService} from '../order.service';
import {AlertData} from "../../../../bean/alertData";

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';
import {Order} from "../../../../bean/order";
import {Position} from "../../../../bean/position";
import {Operation} from "../../../../bean/operation";
import {CorpBuilding} from "../../../../bean/corpBuilding";
import {Corporation} from "../../../../bean/corporation";
import {CorpBuildingService} from "../../../basicSettings/corporation/corpBuilding.service";
import {CorporationService} from "../../../basicSettings/corporation/corporation.service";
import {GroupService} from "../../../basicSettings/group/group.service";
import {Group} from "../../../../bean/group";
import {LmTime} from "../../../components/lmtimepicker/lmtime";
import {OperationService} from "../../operations.service";
import {SwitchService} from "../../../main/switchService";

@Component({
  selector:'order-edit',
  templateUrl:'./order-edit.component.html',
  styleUrls:['./order-edit.component.scss']
})

export class OrderEditComponent implements OnInit{

  order=new Order(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
  groups:Group[]=[];
  private today=new Date(0,0,0);
  private time=new LmTime(0,0,0);

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private orderService:OrderService,
    private groupService:GroupService,
    private corporationService:CorporationService,
    private corpBuildingService:CorpBuildingService,
    private dialogService:DialogService,
    private operationService:OperationService,
    private switchService:SwitchService,
    private missionService:MissionService
  ){
  };


  ngOnInit(){
    this.auth();
    this.route.params.subscribe((params: Params) =>{
      this.getData(params.id);
    })
  }

  //从user对象中，找出对应该页面的auths数组
  private subscription;
  private pageAuths=[];
  private pageChildrenAuths=[];
  private showSaveBtn:boolean=false;
  private showChildrenAddBtn:boolean=false;
  private showChildrenListEditBtn:boolean=false;
  private showChildrenListDeleteBtn:boolean=false;
  private auth(){
    let user=this.switchService.getUser();
    if(user){
      //main组件早已经加载完毕的情况
      this.pageAuths=this.initAuth('order');
      this.pageChildrenAuths=this.initAuth('operation');
      this.initComponentAuth();
    }
    else{
      //和main组件一同加载的情况
      this.subscription=this.missionService.hasAuth.subscribe(()=>{
        this.pageAuths=this.initAuth('order');
        this.pageChildrenAuths=this.initAuth('operation');
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
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='edit'){
        this.showSaveBtn=true;
      }
    }
    for(let auth of this.pageChildrenAuths){
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='add'){
        this.showChildrenAddBtn=true;
      }
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='edit'){
        this.showChildrenListEditBtn=true;
      }
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='delete'){
        this.showChildrenListDeleteBtn=true;
      }
    }
  }

  private groupLoading:boolean=false;
  private initGroup(callback){
    this.groupLoading=true;
    this.groupService.getGroupList(null).then(
      data=>{
        this.groupLoading=false;
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          //console.log(result);
          for(let data of result.data){
            let group=new Group(data.id,data.name,null,data.status);
            this.groups.push(group);
          }
          callback();
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
  private initCorporation(callback){
    this.corporationLoading=true;
    this.corporations.splice(0,this.corporations.length);
    this.corporationService.getCorporationList(null,this.order.group).then(
      data=>{
        this.corporationLoading=false;
        let result=this.apiResultService.result(data);
        console.log(result);
        if(result.status==0){
          for(let data of result.data){
            let corp=new Corporation(data.id,data.name,data.description,data.group,data.status);
            this.corporations.push(corp);
          }
          callback();
/*          if(this.corporations.length>0){
            this.order.corporation=new Corporation(this.corporations[0].id,this.corporations[0].name,this.corporations[0].description,this.corporations[0].group,this.corporations[0].status);
            console.log(this.order);
            this.initCorpBuilding();
          }*/
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
  private initCorpBuilding(callback){
    this.corpBuildingLoading=true;
    this.corpBuildings.splice(0,this.corpBuildings.length);
    this.corpBuildingService.getCorporationList(this.order.corporation.id).then(
      data=>{
        this.corpBuildingLoading=false;
        let result=this.apiResultService.result(data);
        console.log(result);
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
          callback();
        }
      },
      error=>{
        this.corpBuildingLoading=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private isLoading=false;
  private operations;
  private getData(id){
    this.orderService.getOrder(id).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.data){
          this.order.custom_name=result.data.custom_name;
          this.order.custom_phone=result.data.custom_phone;
          this.order.remark=result.data.remark;
          this.order.id=result.data.id;
          this.operations=result.data.operations;

          if(this.operations instanceof Array&&this.operations.length>0 ){
            for(let d of this.operations){
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
          this.initGroup(()=>{
            this.order.group=result.data.corporation.groupId;
            this.initCorporation(()=>{
              this.order.corporation=result.data.corporation;
              this.initCorpBuilding(()=>{
                this.order.custom_position=result.data.corpBuilding;
              })
            });
          });
          this.order.incoming_date_timestamp=result.data.incoming_time;
          let dateEdit=new Date(this.order.incoming_date_timestamp);
          this.today=new Date(dateEdit.getFullYear(),dateEdit.getMonth(),dateEdit.getDate());
          this.time=new LmTime(dateEdit.getHours(),dateEdit.getMinutes(),dateEdit.getSeconds());

        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private refresh(){
    this.route.params.subscribe((params: Params) =>{
      this.getData(params.id);
    })
  }

  private onSubmit(){
    console.log(this.order);
    this.orderService.create(this.order).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.router.navigate(['../'],{relativeTo:this.route});
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private onTimeChange($event){

  }
  private onGroupChange($event){
    this.corporationLoading=true;
    this.corporations.splice(0,this.corporations.length);
    this.corporationService.getCorporationList(null,this.order.group).then(
      data=>{
        this.corporationLoading=false;
        let result=this.apiResultService.result(data);
        console.log(result);
        if(result.status==0){
          for(let data of result.data){
            let corp=new Corporation(data.id,data.name,data.description,data.group,data.status);
            this.corporations.push(corp);
          }
          this.order.corporation=this.corporations[0];
          this.onCorporationChange(null);
        }
      },
      error=>{
        this.corporationLoading=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }
  private onCorporationChange($event){
    this.corpBuildingLoading=true;
    this.corpBuildings.splice(0,this.corpBuildings.length);
    this.corpBuildingService.getCorporationList(this.order.corporation.id).then(
      data=>{
        this.corpBuildingLoading=false;
        let result=this.apiResultService.result(data);
        console.log(result);
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
        }
        this.order.custom_position=this.corpBuildings[0];
      },
      error=>{
        this.corpBuildingLoading=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private add(){
    this.route.params.subscribe((params: Params) => {
      this.router.navigate(['op/add/'+params.id], {relativeTo: this.route.parent.parent});
    });
  }
  private result;
  private editRow(id){
    this.router.navigate(['op/'+id],{relativeTo:this.route.parent.parent});
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
              this.refresh();
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
}
