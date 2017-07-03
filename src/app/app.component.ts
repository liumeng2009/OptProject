import { Component,OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

import {PanelBarItemModel} from "@progress/kendo-angular-layout";

import {User} from './bean/user';

import {AppService} from "./app.service";
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

  constructor(router:Router,private appService:AppService,private title:Title,private location:Location){
    /*
    for(let i=0;i<router.config.length;i++){
      if(!router.config[i].data.show){
        router.config.splice(i,1);
        i--;
      }
    }
    */
    this.router=router;
  }

  ngOnInit(){
    this.appService.getUserInfo()
      .subscribe(
        data=>{
          if(data.status==0){
            this.user=data.data;
            this.title.setTitle('首页');
          }
          else{
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
    let url=this.location.path();
    this.selectedId=url;
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
    this.user=user;
  }


}
