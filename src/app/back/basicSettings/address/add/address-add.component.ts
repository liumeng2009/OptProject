import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import {Building} from '../../../../bean/building';

import {MissionService} from '../../../main/mission.service';

import {AddressService} from '../address.service';
import {AlertData} from "../../../../bean/alertData";

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';

@Component({
  selector:'address-add',
  templateUrl:'./address-add.component.html',
  styleUrls:['./address-add.component.scss']
})

export class AddressAddComponent implements OnInit{

  building=new Building('','',0,0,1);

  constructor(
    private missionService:MissionService,
    private addressService:AddressService,
    private router:Router,
    private route:ActivatedRoute
  ){

  };


  ngOnInit(){
  }

  private onSubmit(){
    //alert(this.building);
    this.addressService.create(this.building).then(
      data=>{
        console.log(data);
        if(data.status==0){
          this.missionService.change.emit(new AlertData('success','保存成功'));
          //this.toastr.success('保存成功!', 'Success!');
          this.router.navigate(['../'],{relativeTo:this.route});
        }
        else if(data.status==500){
          this.missionService.change.emit(new AlertData('danger',new OptConfig().unknownError));
        }
        else{
          this.missionService.change.emit(new AlertData('danger',data.message));
        }
      },
    error=>{

    }
    )

  }
}
