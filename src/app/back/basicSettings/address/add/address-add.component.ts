import {Component} from '@angular/core';

import {Building} from '../../../../bean/building';

@Component({
  selector:'address-add',
  templateUrl:'./address-add.component.html',
  styleUrls:['./address-add.component.scss']
})

export class AddressAddComponent{

  building=new Building('','',0,0);

  constructor(

  ){};

  private onSubmit(){
    alert(this.building);
  }
}
