import {Component,OnInit,Output,EventEmitter} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import {PageChangeEvent} from '@progress/kendo-angular-grid';

import {AddressService} from '../address.service';


import {AlertData} from '../../../../bean/alertData'

import {MissionService} from '../../../main/mission.service';

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';


@Component({
  selector:'address-list',
  templateUrl:'./address-list.component.html',
  styleUrls:['./address-list.component.scss']
})

export class AddressListComponent implements OnInit{

  private gridData: any[];

  private height:number=0;
  private pageSize:number=10;
  private skip:number=0;

  constructor(
    private addressService:AddressService,
    private router:Router,
    private route:ActivatedRoute,
    private missionService:MissionService,
    private apiResultService:ApiResultService
  ){};



  ngOnInit(){
    this.height=(window.document.body.clientHeight-70-56-50-20);
    this.getData();
  }

  private getData(){
    this.addressService.getAddressList()
      .subscribe(
        data=>{
          console.log(data);
          this.apiResultService.result(data,this.gridData);
        },
        error=>{
          console.log(error);
          this.missionService.change.emit(new AlertData('danger',error));

        }
      );
  }

  private refresh(){
    this.getData();
  }

  private add(){
    this.router.navigate(['add'],{relativeTo:this.route.parent});
    //this.router.navigateByUrl('/admin/basic/address');
  }

  private pageChange(event,PageChangeEvent){
    alert(event.skip);
  }

}
