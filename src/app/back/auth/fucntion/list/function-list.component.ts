import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import {PageChangeEvent,GridDataResult} from '@progress/kendo-angular-grid';
import {DialogService,DialogRef,DialogCloseResult,DialogResult} from '@progress/kendo-angular-dialog';

import {FunctionService} from "../function.service";
import {ApiResultService} from "../../../main/apiResult.service";
import {AjaxExceptionService} from "../../../main/ajaxExceptionService";
import {OptConfig} from "../../../../config/config";

@Component({
  selector:'function-list',
  templateUrl:'./function-list.component.html',
  styleUrls:['./function-list.component.scss']
})

export class FunctionListComponent implements OnInit{

  private gridData:GridDataResult={
    data:[],
    total:0
  };

  private height:number=0;
  private result;
  private isLoading:boolean=true;

  constructor(
    private functionService:FunctionService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private dialogService:DialogService
  ){
  };

  ngOnInit(){
    this.height=(window.document.body.clientHeight-70-56-50-20);
    this.getData();
  }

  private getData(){
    this.functionService.getList()
      .then(
        data=>{
          if(this.apiResultService.result(data)) {
            this.gridData.data = this.apiResultService.result(data).data;
          }
          this.isLoading=false;
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
          this.isLoading=false;
        }
      );
  }

  private getOperates(){
    this.functionService.getOpList().then(
      data=>{
        let result=this.apiResultService.result(data);
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private refresh(){
    this.gridData.data=[];
    this.gridData.total=0;
    this.isLoading=true;
    this.getData();
  }
}
