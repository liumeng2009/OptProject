import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import {Building} from '../../../../bean/building';

import {MissionService} from '../../../main/mission.service';

import {AddressService} from '../address.service';
import {AlertData} from "../../../../bean/alertData";


@Component({
  selector:'address-add',
  templateUrl:'./address-add.component.html',
  styleUrls:['./address-add.component.scss']
})

export class AddressAddComponent implements OnInit{

  building=new Building('','',0,0);

  constructor(
    private missionService:MissionService,
    private addressService:AddressService,
    private router:Router,
    private route:ActivatedRoute
  ){};


  ngOnInit(){
  }

  private onSubmit(){
    //alert(this.building);
    this.addressService.create(this.building).subscribe(
      data=>{
        console.log(data);
        if(data.status==0){
          this.missionService.change.emit(new AlertData('success','保存成功'));
          this.router.navigate(['../'],{relativeTo:this.route});
        }
      //this.gridData=data.data;
      },
    error=>{
      //this.router.navigate(['/login']);
      console.log(error);

    }
    )

  }
}
