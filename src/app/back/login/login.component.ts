import {Component,OnInit} from '@angular/core';

import {User} from '../../bean/user'

import {LoginService} from './login.service'

@Component({
  selector:'login-area',
  templateUrl:'./login.component.html',
  styleUrls:['./login.component.scss']
})

export class LoginComponent{

  errorMessage:''

  constructor(
    private loginService:LoginService
  ){};
  user=new User('','');
  onButtonClick():void{
    this.loginService.login(this.user.username,this.user.password)
      .subscribe(
        user=>alert(JSON.stringify(user)),
        error=>this.errorMessage=<any>error
      );
  }
}
