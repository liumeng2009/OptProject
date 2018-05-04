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
import {SwitchService} from "../../../main/switchService";
import {MissionService} from "../../../main/mission.service";

@Component({
  selector:'user-edit',
  templateUrl:'./user-edit.component.html',
  styleUrls:['./user-edit.component.scss']
})

export class UserEditComponent implements OnInit{

  user=new User(null,null,null,null,null,null,true,null,null,null);

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
    private ajaxExceptionService:AjaxExceptionService,
    private switchService:SwitchService,
    private missionService:MissionService
  ){

  };


  ngOnInit(){
    this.auth();
    this.initRoles();
    this.route.params.subscribe((params: Params) =>{
      this.getData(params.id);
    })
  }

  //从user对象中，找出对应该页面的auths数组
  private subscription;
  private pageAuths=[];
  private showSaveBtn:boolean=false;
  private auth(){
    let user=this.switchService.getUser();
    if(user){
      //main组件早已经加载完毕的情况
      this.pageAuths=this.initAuth('user');
      this.initComponentAuth();
    }
    else{
      //和main组件一同加载的情况
      this.subscription=this.missionService.hasAuth.subscribe(()=>{
        this.pageAuths=this.initAuth('user');
        this.initComponentAuth();
      });
    }
  }
  private initAuth(functioncode){
    let resultArray=[];
    let user=this.switchService.getUser();
    if(user&&user.role&&user.role.auths){
      let auths=user.role.auths;
      console.log(auths);
      for(let auth of auths){
        if(auth.opInFunc
          &&auth.opInFunc.function
          &&auth.opInFunc.function.code
          &&auth.opInFunc.function.code==functioncode
        ){
          resultArray.push(auth);
        }
      }
    }
    return resultArray;
  }
  //根据auth数组，判断页面一些可操作组件的可用/不可用状态
  private initComponentAuth(){
    for(let auth of this.pageAuths){
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='edit'){
        this.showSaveBtn=true;
      }
    }
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
