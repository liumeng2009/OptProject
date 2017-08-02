import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

import {CookieService} from 'angular2-cookie/core';

import {User} from '../../bean/user'

import { ToastsManager,ToastOptions } from 'ng2-toastr/ng2-toastr';

import {RegService} from './reg.service'
import {OptConfig} from "../../config/config";
import {environment} from "../../../environments/environment";

@Component({
  selector:'reg-area',
  templateUrl:'./reg.component.html',
  styleUrls:['./reg.component.scss']
})

export class RegComponent implements OnInit{

  private iconClass:string='k-icon k-i-track-changes-enable';
  private isDisabled:boolean=false;
  private showPasswordIcon='glyphicon glyphicon-eye-open';
  private showPassword;boolean=false;

  constructor(
    private regService:RegService,
    private cookieService:CookieService,
    private router:Router,
    private title:Title,
    private toastr:ToastsManager,
    private vcr:ViewContainerRef
  ){
    this.toastr.setRootViewContainerRef(vcr);
  };
  user=new User('','');

  ngOnInit(){
    this.title.setTitle('注册');
  }


  onButtonClick():void{
    this.isDisabled=true;
    this.iconClass='k-icon k-i-loading';
    this.regService.login(this.user.username,this.user.password)
      .then(
        data=>{
          if(data.status==0){
            //this.user=data.data;
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

  previewPassword():void{
    if(this.showPassword){
      this.showPassword=false;
      this.showPasswordIcon='glyphicon glyphicon-eye-open';
    }
    else{
      this.showPassword=true;
      this.showPasswordIcon='glyphicon glyphicon-eye-close';
    }
  }
}
