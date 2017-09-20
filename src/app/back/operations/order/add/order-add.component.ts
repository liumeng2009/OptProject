import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

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

@Component({
  selector:'order-add',
  templateUrl:'./order-add.component.html',
  styleUrls:['./order-add.component.scss']
})

export class OrderAddComponent implements OnInit{

  order=new Order(null,null,null,null,null,null,null,null,null,null,null,null,null);
  groups:Group[]=[];
  public value: Date = new Date(2000, 2, 10, 10, 30, 0);

  constructor(
    private orderService:OrderService,
    private groupService:GroupService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private corporationService:CorporationService
  ){
  };

  ngOnInit(){
    this.initGroup();
  }

  private initGroup(){
    this.groupService.getGroupList(null).then(
      data=>{
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
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }
  private corporations:Corporation[]=[];
  private initCorporation(){
    this.corporations.splice(0,this.corporations.length);
    this.corporationService.getCorporationList(null,this.order.group).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result.status==0){
          for(let data of result.data){
            let corp=new Corporation(data.id,data.name,data.description,data.groupId,data.status);
            this.corporations.push(corp);
          }
          this.order.corporation=this.corporations[0]?this.corporations[0].id:''
          console.log(this.order)
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
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
}
