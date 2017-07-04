import {Component,OnInit} from '@angular/core';
import {Router} from '@angular/router'
import {Location} from '@angular/common';

import {PanelBarItemModel} from "@progress/kendo-angular-layout";

import {User} from '../../bean/user'
import {AlertData} from '../../bean/alertData'


import {MainService} from './main.service'

@Component({
  selector:'main-area',
  templateUrl:'./main.component.html',
  styleUrls:['./main.component.scss']
})

export class MainComponent implements OnInit{
  private user:User;
  private router:Router;
  private selectedId:string='';
  alertData:AlertData={
    type:'',
    info:''
  }

  constructor(router:Router,private mainService:MainService,private location:Location){
    this.router=router;
  }

  ngOnInit(){
    this.mainService.getUserInfo()
      .subscribe(
        data=>{
          if(data.status==0){
            this.user=data.data;
          }
          else{
            this.router.navigate(['/login']);
          }
        },
        error=>{
          this.router.navigate(['/login']);
          /*
          this.alertData={
            type:'danger',
            info:<any>error
          }
          */
        }
      );
    let url=this.location.path();
    url=url.substring(1,url.length);
    this.selectedId=url;
  }

  public stateChange(data:Array<PanelBarItemModel>):boolean{
    let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];

    if (focusedEvent.id !== "default-0") {
      this.selectedId = focusedEvent.id;
      this.router.navigate(["/" + focusedEvent.id]);
    }
    return false;
  }

  private baseImageUrl: string = "./assets/image/";

  private imageUrl(imageName: string) :string {
    return this.baseImageUrl + imageName + ".jpg";
  }

  private logout(){
    alert(123);
  }


}
