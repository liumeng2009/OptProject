import { Component,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {PanelBarItemModel} from "@progress/kendo-angular-layout";

import {User} from './bean/user';

import {MainService} from "./back/main/main.service";
import {AlertData} from "./bean/alertData";
import {Title} from "@angular/platform-browser";

import {LoginComponent} from './back/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  private router:Router;
  private selectedId:string='';
  private user:User;

  alertData:AlertData={
    type:'',
    info:''
  }

  constructor(router:Router,private mainService:MainService,private title:Title){
    this.router=router;
  }

  ngOnInit(){
    this.mainService.getUserInfo()
      .subscribe(
        data=>{
          if(data.status==0){
            console.log(JSON.stringify(data));
            //this.user=data.data;
          }
          else{
            /*
            this.alertData={
              type:'info',
              info:'请先登录'
            }
            */
            this.title.setTitle('登录');
          }
        },
        error=>{
          this.alertData={
            type:'danger',
            info:<any>error
          }
        }
      );
  }

  public stateChange(data:Array<PanelBarItemModel>):boolean{
    let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];

    if (focusedEvent.id !== "info") {
      this.selectedId = focusedEvent.id;
      this.router.navigate(["/" + focusedEvent.id]);
    }
    return false;
  }

  userChange(user:User){
    alert('接到子组件消息了');
    this.user=user;
  }


}
