import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import {MissionService} from '../../../main/mission.service';

import {OrderService} from '../order.service';
import {AlertData} from "../../../../bean/alertData";

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';
import {Order} from "../../../../bean/order";
import {Position} from "../../../../bean/position";
import {Operation} from "../../../../bean/operation";

@Component({
  selector:'order-edit',
  templateUrl:'./order-edit.component.html',
  styleUrls:['./order-edit.component.scss']
})

export class OrderEditComponent implements OnInit{

  business=new Order(null,null,null,null,null,null,null,null,null,null,null,null,null);

  constructor(
    private orderService:OrderService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService
  ){
  };


  ngOnInit(){
    this.route.params.subscribe((params: Params) =>{
      this.getData(params.id);
    })
  }

  private getData(id){
    this.orderService.getOrder(id).then(
      data=>{
        let result=this.apiResultService.result(data);
        console.log(this.business);

      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private onSubmit(){
    console.log(this.business);
    this.orderService.create(this.business).then(
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
