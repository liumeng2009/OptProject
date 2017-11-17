import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import {UserService} from '../user.service';
import {AlertData} from "../../../../bean/alertData";

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';
import {User} from "../../../../bean/user";
import {Gender} from "../../../../bean/gender";

@Component({
  selector:'user-edit',
  templateUrl:'./user-edit.component.html',
  styleUrls:['./user-edit.component.scss']
})

export class UserEditComponent implements OnInit{

  user=new User(null,null,null,null,null,null,true);

  genders=[
    new Gender('男',false),
    new Gender('女',true)
  ]

  constructor(
    private userService:UserService,
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

  private getData(id:string){
    this.userService.getUser(id).then(
      data=>{
        let userObj=this.apiResultService.result(data);
        if(userObj){
          this.user.name=userObj.data.name;
          this.user.password=userObj.data.password;
          this.user.canLogin=userObj.data.canLogin;
          this.user.gender=userObj.data.gender.toString();
          this.user.phone=userObj.data.phone;
          this.user.email=userObj.data.email;
          this.user.id=id;
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
    console.log(this.user);
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
}
