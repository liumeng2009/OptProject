import {Component,OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

import {CookieService} from 'angular2-cookie/core';

import {User} from '../../bean/user'

import {LoginService} from './login.service'

import {environment} from '../../../environments/environment'
import {OptConfig} from "../../config/config";

@Component({
  selector:'login-area',
  templateUrl:'./login.component.html',
  styleUrls:['./login.component.scss']
})

export class LoginComponent implements OnInit{

  constructor(
    private loginService:LoginService,
    private cookieService:CookieService,
    private router:Router,
    private title:Title
  ){};

  private errorMessage:string

  user=new User('','');

  ngOnInit(){
    this.title.setTitle('登录');
  }


  onButtonClick():void{
    this.loginService.login(this.user.username,this.user.password)
      .then(
        data=>{
          if(data.status==0){
            //this.user=data.data;
            this.router.navigate(['/admin']);
            let date=new Date();
            date.setDate(date.getDate()+999);
            this.cookieService.put('optToken',data.data.token,{expires:date});
          }
          else{
            this.errorMessage=data.message
          }
        },
        error=>{
          if(environment.production){
            this.errorMessage=new OptConfig().ajaxError;
          }
          else {
            this.errorMessage = error;
          }
        }

      );
  }
}
