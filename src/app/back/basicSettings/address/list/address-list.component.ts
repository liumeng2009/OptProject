import {Component,OnInit,Output,EventEmitter} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import {PageChangeEvent,GridDataResult} from '@progress/kendo-angular-grid';

import {AddressService} from '../address.service';


import {AlertData} from '../../../../bean/alertData'

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';


@Component({
  selector:'address-list',
  templateUrl:'./address-list.component.html',
  styleUrls:['./address-list.component.scss']
})

export class AddressListComponent implements OnInit{

  private gridData:GridDataResult={
    data:[],
    total:0
  };

  private height:number=0;
  private pageSize:number=new OptConfig().pageSize;
  private skip:number=0;
  private total:number=0;
  private firstRecord:number=0;
  private lastRecord:number=0;

  constructor(
    private addressService:AddressService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService
  ){};



  ngOnInit(){
    this.height=(window.document.body.clientHeight-70-56-50-20);
    this.getData(1);
  }

  private getData(pageid){
    this.addressService.getAddressList(pageid)
      .then(
        data=>{
          console.log(data);
          this.gridData.data=this.apiResultService.result(data).data;
          this.total=this.gridData.total=this.apiResultService.result(data).total;
          //alert(this.total);
          this.firstRecord=this.skip+1;
          this.lastRecord=this.apiResultService.result(data).data.length+this.skip;
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);

        }
      );
  }

  private refresh(){
    this.getData(this.skip==0?1:this.skip/this.pageSize);
  }

  private add(){
    this.router.navigate(['add'],{relativeTo:this.route.parent});
    //this.router.navigateByUrl('/admin/basic/address');
  }

  private pageChange(event,PageChangeEvent){
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
  }

}
