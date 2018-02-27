import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import {UserService} from '../user.service';
import {AlertData} from "../../../../bean/alertData";

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';
import {User} from "../../../../bean/user";
import {Gender} from "../../../../bean/gender";
import {Role} from "../../../../bean/role";
import {RoleService} from "../../role/role.service";

@Component({
  selector:'user-edit',
  templateUrl:'./user-edit.component.html',
  styleUrls:['./user-edit.component.scss']
})

export class UserEditComponent implements OnInit{

  user=new User(null,null,null,null,null,null,true,null);

  genders=[
    new Gender('男',false),
    new Gender('女',true)
  ]


  constructor(
    private userService:UserService,
    private roleService:RoleService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService
  ){

  };


  ngOnInit(){
    this.initRoles();
    this.route.params.subscribe((params: Params) =>{
      this.getData(params.id);
    })
  }

  private getData(id:string){
    this.userService.getUser(id).then(
      data=>{
        let userObj=this.apiResultService.result(data);
        if(userObj&&userObj.status==0){
          this.user=userObj.data;
        }
        else{
          //编辑页面没有内容，说明内容获取出错，返回list页面
          this.router.navigate(['../'],{relativeTo:this.route});
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private onSubmit(){
    this.userService.create(this.user).then(
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
  private femaleChange($event){
    console.log($event);
    this.user.gender=false;
  }
  private maleChange($event){
    console.log($event);
    this.user.gender=true;
  }

  private roles:Role[]=[];
  private isRoleLoading:boolean=false;
  private initRoles(){
    this.roles.splice(0,this.roles.length);
    this.isRoleLoading=true;
    this.roleService.getRoleList().then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.roles=result.data;
          if(this.roles.length>0){
            this.user.roleId=this.roles[0].id;
          }
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }
}
