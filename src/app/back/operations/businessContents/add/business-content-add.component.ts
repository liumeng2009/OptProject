import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import {MissionService} from '../../../main/mission.service';

import {BusinessContentService} from '../businessContent.service';
import {AlertData} from "../../../../bean/alertData";

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';
import {BusinessContent} from "../../../../bean/businessContent";
import {Position} from "../../../../bean/position";
import {Operation} from "../../../../bean/operation";
import {EquipType} from "../../../../bean/equipType";

@Component({
  selector:'business-add',
  templateUrl:'./business-content-add.component.html',
  styleUrls:['./business-content-add.component.scss']
})

export class BusinessContentAddComponent implements OnInit{
  private types:EquipType[]=[];
  private operations:Operation[]=[];
  private oneChecked:boolean=this.operations[0]&&this.operations[0].checked
    ||this.operations[1]&&this.operations[1].checked
    ||this.operations[2]&&this.operations[2].checked
    ||this.operations[3]&&this.operations[3].checked
    ||this.operations[4]&&this.operations[4].checked;

  business=new BusinessContent(null,null,this.operations);

  constructor(
    private businessContentService:BusinessContentService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService
  ){
  };


  ngOnInit(){
    this.initTypes();
    this.initOperations();
  }

  private initTypes(){
    this.businessContentService.getType().then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result.status==0){
          for(let d of result.data){
            let type=new EquipType(null,d.name,d.code);
            this.types.push(type);
          }
          this.business.type=this.types[0]?this.types[0].code:null;
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private initOperations(){
    this.businessContentService.getOp().then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result.status==0){
          for(let d of result.data){
            let op=new Operation(d.code,false,d.name,5,null,null);
            this.operations.push(op);
          }
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private onSubmit(){
    console.log(this.business);
    this.businessContentService.create(this.business).then(
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
