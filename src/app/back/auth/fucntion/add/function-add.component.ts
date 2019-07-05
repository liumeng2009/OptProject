import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import {MissionService} from '../../../main/mission.service';

import {FunctionService} from '../function.service';
import {AlertData} from "../../../../bean/alertData";

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';
import {Function} from "../../../../bean/function";
import {Floor} from "../../../../bean/floor";

@Component({
  selector:'function-add',
  templateUrl:'./function-add.component.html',
  styleUrls:['./function-add.component.scss']
})

export class FunctionAddComponent implements OnInit{

  functionObj=new Function(null,null,null,null,null);
  classArray:Floor[]=[];

  constructor(
    private functionService:FunctionService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService
  ){

  };


  ngOnInit(){
    this.initClassArray();
    this.initParentClass();
  }
   initClassArray(){
    let class1=new Floor('0',0);
    let class2=new Floor('1',1);
    this.classArray.push(class1);
    this.classArray.push(class2);
    this.functionObj.classs=class1.value;
  }

   parentFunction:Function[]=[];
   isLoadingParentFunction:boolean=false;
   initParentClass(){
    this.parentFunction.splice(0,this.parentFunction.length);
    this.functionService.getParentList().then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.parentFunction=result.data;
          let i=0;
          for(let d of result.data){
            this.parentFunction[i].classs=d.class;
            i++;
          }
          if(result.data.length>0){
            this.functionObj.belong=result.data[0].id;
          }
        }
      },
      error=>{
        this.isLoadingParentFunction=true;
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

   onSubmit(){
    console.log(this.functionObj);
    this.functionService.create(this.functionObj).then(
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
