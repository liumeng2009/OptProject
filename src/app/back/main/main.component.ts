import {Component,OnInit} from '@angular/core';

import {User} from '../../bean/user'

import {MainService} from './main.service'

@Component({
  selector:'main-area',
  templateUrl:'./main.component.html',
  styleUrls:['./main.component.scss']
})

export class MainComponent implements OnInit{

  errorMessage:string

  constructor(
    private mainService:MainService
  ){};

  ngOnInit(){
    //alert(123);
    this.mainService.getUserInfo()
      .subscribe(
        data=>{
          if(data.status==0){
            alert('成功');
          }
          else{
            this.errorMessage=data.message;
          }
        },
        error=>this.errorMessage=<any>error
      );
  }

  private baseImageUrl: string = "http://demos.telerik.com/kendo-ui/content/web/panelbar/";

  private imageUrl(imageName: string) :string {
    return this.baseImageUrl + imageName + ".jpg";
  }

}
