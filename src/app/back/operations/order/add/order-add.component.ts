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

@Component({
  selector:'order-add',
  templateUrl:'./order-add.component.html',
  styleUrls:['./order-add.component.scss']
})

export class OrderAddComponent implements OnInit{

  order=new Order(null,null,null,null,null,null,null,null);
  groups:Group[]=[];

  constructor(
    private orderService:OrderService,
    private groupService:GroupService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService
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
          for(let data of result.data){
            let group=new Group(data.id,data.name,null,data.status);
            this.groups.push(group);
          }
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
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
