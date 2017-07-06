import {Component,OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

import {CookieService} from 'angular2-cookie/core';

import {User} from '../../bean/user'

import {LoginService} from './login.service'
import {AlertData} from "../../bean/alertData";

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
  user=new User('','');

  ngOnInit(){
    this.title.setTitle('登录');
  }

  alertData:AlertData={
    type:'',
    info:''
  };

  onButtonClick():void{
    this.loginService.login(this.user.username,this.user.password)
      .subscribe(
        data=>{
          if(data.status==0){
            //this.user=data.data;
            this.router.navigate(['/admin']);
            let date=new Date();
            date.setDate(date.getDate()+999);
            this.cookieService.put('optToken',data.data.token,{expires:date});
          }
          else{
            this.alertData={
              type:'danger',
              info:data.message
            }
          }
        },
        error=>{
          this.alertData={
            type:'danger',
            info:error
          }
        }

      );
  }
}
