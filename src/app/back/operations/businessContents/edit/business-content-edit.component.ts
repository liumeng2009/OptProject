import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import {MissionService} from '../../../main/mission.service';

import {BusinessContentService} from '../businessContent.service';
import {AlertData} from "../../../../bean/alertData";

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';
import {BusinessContent,BusinessContentPage} from "../../../../bean/businessContent";
import {Position} from "../../../../bean/position";
import {Operation} from "../../../../bean/operation";
import {EquipType} from "../../../../bean/equipType";

@Component({
  selector:'business-edit',
  templateUrl:'./business-content-edit.component.html',
  styleUrls:['./business-content-edit.component.scss']
})

export class BusinessContentEditComponent implements OnInit{
  private types:EquipType[]=[];
  private operationsDesk:Operation[]=[];
  private operationsSys:Operation[]=[];
  private oneChecked:boolean=this.operationsDesk[0]&&this.operationsDesk[0].checked
    ||this.operationsDesk[1]&&this.operationsDesk[1].checked
    ||this.operationsDesk[2]&&this.operationsDesk[2].checked
    ||this.operationsDesk[3]&&this.operationsDesk[3].checked
    ||this.operationsDesk[4]&&this.operationsDesk[4].checked
    ||this.operationsSys[0]&&this.operationsSys[0].checked
    ||this.operationsSys[1]&&this.operationsSys[1].checked
    ||this.operationsSys[2]&&this.operationsSys[2].checked
    ||this.operationsSys[3]&&this.operationsSys[3].checked
    ||this.operationsSys[4]&&this.operationsSys[4].checked;

  business=new BusinessContentPage(null,null,this.operationsDesk,this.operationsSys,null,null);

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
    this.route.params.subscribe((params: Params) =>{
      this.getData(params.id);
    })
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
            let op=new Operation(d.code,false,d.name,false,5,null,null);
            let op1=new Operation(d.code,false,d.name,true,5,null,null);
            this.operationsDesk.push(op);
            this.operationsSys.push(op1);
          }
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private getData(id){
    this.businessContentService.getBusiness(id).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.business.type=result.data[0].type;
          this.business.equipment=result.data[0].equipment;
          for(let r of result.data){
            for(let operation of this.business.operationsDesk){
              if(r.operation==operation.op&&!r.isAdvanced){
                operation.checked=true;
                operation.weight=r.weight;
                operation.id=r.id;
                break;
              }
            }
            for(let operation of this.business.operationsSys){
              if(r.operation==operation.op&&r.isAdvanced){
                operation.checked=true;
                operation.weight=r.weight;
                operation.id=r.id;
                break;
              }
            }
          }
          console.log(this.business);
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private onSubmit(){
    console.log(this.business);
    this.businessContentService.edit(this.business).then(
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
