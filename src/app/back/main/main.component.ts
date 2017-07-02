import {Component,OnInit} from '@angular/core';
import {Router} from '@angular/router'

import {User} from '../../bean/user'
import {AlertData} from '../../bean/alertData'

import {MainService} from './main.service'

import {LoginComponent} from '../login/login.component'

@Component({
  selector:'main-area',
  templateUrl:'./main.component.html',
  styleUrls:['./main.component.scss']
})

export class MainComponent implements OnInit{

  alertData:AlertData={
    type:'',
    info:''
  }

  constructor(
    private mainService:MainService,
    private router:Router
  ){};

  ngOnInit(){
    this.mainService.getUserInfo()
      .subscribe(
        data=>{
          if(data.status==0){
            this.alertData={
              type:'success',
              info:data.message
            }
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
            info:<any>error
          }
        }
      );
  }

  private baseImageUrl: string = "./assets/image/";

  private imageUrl(imageName: string) :string {
    return this.baseImageUrl + imageName + ".jpg";
  }

}
