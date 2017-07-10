import {Component,OnInit,ElementRef} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import {PageChangeEvent} from '@progress/kendo-angular-grid';

import {AddressService} from '../address.service';

import {AlertData} from '../../../../bean/alertData'


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
    private el:ElementRef
  ){};

  private alertData:AlertData={
    type:'',
    info:''
  }



  ngOnInit(){
    this.height=(window.document.body.clientHeight-70-56-50-20);
    this.getData();
  }

  private getData(){
    this.addressService.getAddressList()
      .subscribe(
        data=>{
          console.log(data);
          this.gridData=data.data;
        },
        error=>{
          //this.router.navigate(['/login']);
          console.log(error);
          this.alertData={
            type:'danger',
            info:<any>error
          }

        }
      );
  }

  private refresh(){
    this.getData();
  }

  private add(){
    this.router.navigate(['add'],{relativeTo:this.route.parent});
  }

  private pageChange(event,PageChangeEvent){
    alert(event.skip);
  }

}
