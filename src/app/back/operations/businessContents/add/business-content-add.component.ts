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

@Component({
  selector:'business-add',
  templateUrl:'./business-content-add.component.html',
  styleUrls:['./business-content-add.component.scss']
})

export class BusinessContentAddComponent implements OnInit{
  private types:Position[]=[];
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
    let pNET=new Position('网络','NET');
    let pHW=new Position('硬件','HARDWARE');
    let pSW=new Position('软件','SOFTWARE');
    let pSYS=new Position('系统','SYSTEM');
    let pOT=new Position('其他','OTHER');
    this.types.push(pHW);
    this.types.push(pSW);
    this.types.push(pNET);
    this.types.push(pSYS);
    this.types.push(pOT);
    this.business.type=this.types[0].value;
  }

  private initOperations(){
    let oSET=new Operation('SETUP',false,'安装',5,null,null);
    let oDE=new Operation('DEBUG',false,'调试',5,null,null);
    let oFIX=new Operation('FIX',false,'修复',5,null,null);
    let oADV=new Operation('ADVICE',false,'咨询',5,null,null);
    let oSUP=new Operation('SUPPORT',false,'现场技术支持',5,null,null);
    this.operations.push(oSET);
    this.operations.push(oDE);
    this.operations.push(oFIX);
    this.operations.push(oADV);
    this.operations.push(oSUP);
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
