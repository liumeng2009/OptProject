import {Component,OnInit} from '@angular/core';

@Component({
  selector:'setting',
  templateUrl:'./setting.component.html',
  styleUrls:['./setting.component.scss']
})

export class SettingComponent implements OnInit{

  constructor(

  ){
  };

  ngOnInit(){

  }

  private baseImageUrl: string = "./assets/image/";

  private imageUrl(imageName: string) :string {
    return this.baseImageUrl + imageName + ".jpg";
  }
}
