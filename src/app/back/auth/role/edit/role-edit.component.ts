import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import {PageChangeEvent,GridDataResult} from '@progress/kendo-angular-grid';

import {RoleService} from '../role.service';
import {AlertData} from "../../../../bean/alertData";
import {FunctionService} from '../../fucntion/function.service'

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';
import {Role} from "../../../../bean/role";

@Component({
  selector:'role-edit',
  templateUrl:'./role-edit.component.html',
  styleUrls:['./role-edit.component.scss']
})

export class RoleEditComponent implements OnInit{

  role=new Role(null,null,null);

  constructor(
    private roleService:RoleService,
    private functionSerivce:FunctionService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService
  ){

  };


  ngOnInit(){
    this.route.params.subscribe((params: Params) =>{
      this.getData(params.id);
    });
    this.initAllAuth();

  }

  private getData(id:string){
    this.roleService.getRole(id).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.role=result.data;
          console.log(this.role);
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private gridData:GridDataResult={
    data:[],
    total:0
  };
  private initAllAuth(){
    this.functionSerivce.getList().then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.gridData=result;
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }


  private onSubmit(){
    this.roleService.edit(this.role).then(
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
