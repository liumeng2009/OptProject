import {Output, EventEmitter, Component, Inject} from '@angular/core';

import {CookieService} from 'angular2-cookie/core';

import {User} from '../../bean/user'

import {LoginService} from './login.service'
import {AlertData} from "../../bean/alertData";

@Component({
  selector:'login-area',
  templateUrl:'./login.component.html',
  styleUrls:['./login.component.scss']
})

export class LoginComponent{

  @Output() updateUser:EventEmitter<User>=new EventEmitter();

  constructor(
    private loginService:LoginService,
    private cookieService:CookieService
  ){};
  user=new User('','');

  alertData:AlertData={
    type:'',
    info:''
  };

  onButtonClick():void{
    this.loginService.login(this.user.username,this.user.password)
      .subscribe(
        data=>{
          if(data.status==0){
            this.user=data.data;

            let date=new Date();
            date.setDate(date.getDate()+999);
            this.cookieService.put('optToken',data.data.token,{expires:date});
            this.updateUser.emit(this.user);
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
