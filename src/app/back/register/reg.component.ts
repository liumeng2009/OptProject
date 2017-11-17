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
    private router:Router,
    private title:Title,
    private toastr:ToastsManager,
    private vcr:ViewContainerRef
  ){
    this.toastr.setRootViewContainerRef(vcr);
  };
  user=new User(null,null,null,null,null,null,null);

  ngOnInit(){
    this.title.setTitle('注册');
  }


  onSubmit():void{
    this.isDisabled=true;
    this.iconClass='k-icon k-i-loading';
    this.regService.reg(this.user.name,this.user.password)
      .then(
        data=>{
          if(data.status==0){
            //this.user=data.data;
            this.toastr.success(data.message||'注册成功！正在跳转到登录页面。。。');
            setTimeout(()=>{
              this.isDisabled=false;
              this.iconClass='k-icon k-i-track-changes-enable';
              this.router.navigate(['/login']);
            },2000);
          }
          else{
            this.isDisabled=false;
            this.iconClass='k-icon k-i-track-changes-enable';
            this.toastr.error(data.message,'注册失败');
          }
        },
        error=>{
          this.isDisabled=false;
          this.iconClass='k-icon k-i-track-changes-enable';
          if(environment.production){
            this.toastr.error(new OptConfig().ajaxError,'注册失败');
            //this.errorMessage=new OptConfig().ajaxError;
          }
          else {
            this.toastr.error(error,'注册失败');
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
