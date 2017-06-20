import {Component,OnInit} from '@angular/core';

import {User} from '../../bean/user'

@Component({
  selector:'login-area',
  templateUrl:'./login.component.html',
  styleUrls:['./login.component.scss']
})

export class LoginComponent{
  constructor(){};
  user=new User('','');
  onButtonClick():void{

  }
}
