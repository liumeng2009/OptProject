import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import {MissionService} from '../../../main/mission.service';

import {OrderService} from '../order.service';
import {GroupService} from '../../../basicSettings/group/group.service'


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

@Component({
  selector:'order-add',
  templateUrl:'./order-add.component.html',
  styleUrls:['./order-add.component.scss']
})

const formGroup = dataItem => new FormGroup({
  'type':new FormControl(dataItem.type),
  'equipment': new FormControl(dataItem.equipment),
  'op': new FormControl(dataItem.op),
  'number': new FormControl(dataItem.number)
});


export class OrderAddComponent implements OnInit{

  order=new Order(null,null,null,null,null,null,null,null,null,null,null,null,null);
  groups:Group[]=[];
  public today: Date = new Date();

  constructor(
    private orderService:OrderService,
    private groupService:GroupService,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private corporationService:CorporationService,
    private corpBuildingService:CorpBuildingService,
    private businessContentService:BusinessContentService
  ){
  };

  ngOnInit(){
    this.order.incoming_date=this.today.toDateString();
    this.initGroup();
    this.initNo();
    this.initTime();

    this.initGroup();

  }

  private groupLoading:boolean=false;
  private initGroup(){
    this.groupLoading=true;
    this.groupService.getGroupList(null).then(
      data=>{
        this.groupLoading=false;
        let result=this.apiResultService.result(data);
        if(result.status==0){
          //console.log(result);
          for(let data of result.data){
            let group=new Group(data.id,data.name,null,data.status);
            this.groups.push(group);
          }
          this.order.group=this.groups[0]?this.groups[0].id:'';
          console.log(this.order);
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
            let corp=new Corporation(data.id,data.name,data.description,data.groupId,data.status);
            this.corporations.push(corp);
          }
          this.order.corporation=this.corporations[0]?this.corporations[0].id:''
          console.log(this.order)
          this.initCorpBuilding();
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
    this.corpBuildingService.getCorporationList(this.order.corporation).then(
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

            let corpBuild=new CorpBuilding(d.id,d.corporationId,d.buildingId,d.floor,d.position,d.status,d.building?d.building.name:null,(d.building?d.building.name:null)+d.floor+'层'+d.position);
            this.corpBuildings.push(corpBuild);
          }
          console.log(this.corpBuildings);
          this.order.custom_position=this.corpBuildings[0]?this.corpBuildings[0].id:'';
          console.log(this.order);
        }
      },
      error=>{
        this.corpBuildingLoading=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private noLoading:boolean=false;
  private initNo(){
    this.noLoading=true;
    let date=new Date(this.today);
    this.orderService.getOrderNo(date.getFullYear(),date.getMonth()+1,date.getDate()).then(
      data=>{
        this.noLoading=false;
        let result=this.apiResultService.result(data);
        if(result.status==0){
          this.order.no=result.data;
        }
      },
      error=>{
        this.noLoading=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }
  private dateChange($event){
    this.today=$event;
    this.order.incoming_date=$event;
    this.initNo();
  }

  private timeLock:boolean=true;
  private timeInterval;
  private initTime(){
    this.timeInterval=setInterval(()=>{
      let date=new Date();
      this.order.hour=date.getHours();
      this.order.minute=date.getMinutes();
      this.order.second=date.getSeconds();
    },1000);
  }
  private timeFocus($event){
    clearInterval(this.timeInterval);
    this.timeLock=false;
  }
  private lockClick($event){
    if(this.timeLock){
      clearInterval(this.timeInterval);
      this.timeLock=false;
    }
    else{
      this.timeLock=true;
      this.timeInterval=setInterval(()=>{
        let date=new Date();
        this.order.hour=date.getHours();
        this.order.minute=date.getMinutes();
        this.order.second=date.getSeconds();
      },1000);
    }
    return false;
  }

  private onSubmit(){
    console.log(this.order);
/*    this.orderService.create(this.order).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.router.navigate(['../'],{relativeTo:this.route});
        }
      },
    error=>{
      this.ajaxExceptionService.simpleOp(error);
    }
    )*/
  }

  private equipTypeLoading:boolean=false;
  private initEquipType(){
    this.equipTypeLoading=true;
    this.businessContentService.getType().then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result.status==0){
          
        }
      },
      error=>{

      }
    )
  }

  private formGroup: FormGroup;
  private myAddRow(grid){
    this.formGroup =formGroup({
      'type':new EquipType('','',''),
      'floor': new Floor('全部',0),
      'position': new Position('全部区域','A'),
      'id':''
    });
    console.log(this.formGroup);
    grid.addRow(this.formGroup);
  }

}
