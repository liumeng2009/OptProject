import {Component,OnInit,Output,EventEmitter} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import {PageChangeEvent} from '@progress/kendo-angular-grid';

import {AddressService} from '../address.service';


import {AlertData} from '../../../../bean/alertData'

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
<<<<<<< HEAD
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService
=======
    private missionService:MissionService,
    private apiResultService:ApiResultService
>>>>>>> parent of 3c94ee7... 201707171818
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
<<<<<<< HEAD
    this.skip=event.skip;
    this.getData(this.skip/this.pageSize+1);
  }

  private editRow(id){
    alert(id);
  }

  private deleteRow(id){
/*    const dialog: DialogRef = this.dialogService.open({
      title: "Please confirm",
      content: "Are you sure?",
      actions: [
        { text: "No" },
        { text: "Yes", primary: true }
      ]
    });*/

/*    dialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
        console.log("close");
      } else {
        console.log("action", result);
      }

      this.result = JSON.stringify(result);
    });*/





    this.addressService.delete(id)
      .then(
        data=>{
          console.log(data)
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
        }
      )
=======
    alert(event.skip);
>>>>>>> parent of 3c94ee7... 201707171818
  }

}
