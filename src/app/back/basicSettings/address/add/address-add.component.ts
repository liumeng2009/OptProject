import {Component,OnInit} from '@angular/core';

import {Building} from '../../../../bean/building';

import {MissionService} from '../../../main/mission.service';

@Component({
  selector:'address-add',
  templateUrl:'./address-add.component.html',
  styleUrls:['./address-add.component.scss']
})

export class AddressAddComponent implements OnInit{

  building=new Building('','',0,0);

  constructor(
    private missionService:MissionService
  ){};

  ngOnInit(){
    //alert(123);
    this.missionService.change.emit(1);
  }

  private onSubmit(){
    alert(this.building);
  }
}
