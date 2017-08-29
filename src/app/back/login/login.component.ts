import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

import {CookieService} from 'angular2-cookie/core';

import {User} from '../../bean/user'

import { ToastsManager,ToastOptions } from 'ng2-toastr/ng2-toastr';

import {LoginService} from './login.service'
import {OptConfig} from "../../config/config";
import {environment} from "../../../environments/environment";

@Component({
  selector:'login-area',
  templateUrl:'./login.component.html',
  styleUrls:['./login.component.scss']
})

export class LoginComponent implements OnInit{

  private iconClass:string='k-icon k-i-lock';
  private isDisabled:boolean=false;

  constructor(
    private loginService:LoginService,
    private cookieService:CookieService,
    private router:Router,
    private title:Title,
    private toastr:ToastsManager,
    private vcr:ViewContainerRef
  ){
    this.toastr.setRootViewContainerRef(vcr);
  };
  user=new User(null,null,null,null,null,null,null);

  ngOnInit(){
    this.title.setTitle('登录');
  }


  onSubmit():void{
    this.isDisabled=true;
    this.iconClass='k-icon k-i-loading';
    this.loginService.login(this.user.username,this.user.password)
      .then(
        data=>{
          if(data.status==0){
            this.toastr.success('欢迎您,'+data.data.name,'登录成功');
            setTimeout(()=>{
              this.isDisabled=false;
              this.iconClass='k-icon k-i-lock';
              this.router.navigate(['/admin']);
              let date=new Date();
              date.setDate(date.getDate()+999);
              this.cookieService.put('optToken',data.data.token,{expires:date});
            },2000);
          }
          else{
            this.isDisabled=false;
            this.iconClass='k-icon k-i-lock';
            this.toastr.error(data.message,'登录失败');
            //this.errorMessage=data.message
          }
        },
        error=>{
          this.isDisabled=false;
          this.iconClass='k-icon k-i-lock';
          if(environment.production){
            this.toastr.error(new OptConfig().ajaxError,'登录失败');
            //this.errorMessage=new OptConfig().ajaxError;
          }
          else {
            this.toastr.error(error,'登录失败');
            //this.errorMessage = error;
          }
        }

      );
  }
}
