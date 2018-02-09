import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import {PageChangeEvent,GridDataResult} from '@progress/kendo-angular-grid';
import {DialogService,DialogRef,DialogCloseResult,DialogResult} from '@progress/kendo-angular-dialog';

import {RoleService} from "../role.service";
import {ApiResultService} from "../../../main/apiResult.service";
import {AjaxExceptionService} from "../../../main/ajaxExceptionService";
import {OptConfig} from "../../../../config/config";

@Component({
  selector:'role-list',
  templateUrl:'./role-list.component.html',
  styleUrls:['./role-list.component.scss']
})

export class RoleListComponent implements OnInit{

  private gridData:GridDataResult={
    data:[],
    total:0
  };

  private height:number=0;
  private result;
  private isLoading:boolean=true;

  constructor(
    private roleService:RoleService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private dialogService:DialogService
  ){
  };

  ngOnInit(){
    this.height=(window.document.body.clientHeight-70-56-50-20-27);
    this.getData();
  }

  private getData(){
    this.roleService.getRoleList()
      .then(
        data=>{
          console.log(data);
          let result=this.apiResultService.result(data);
          if(result&&result.status==0){
            this.gridData.data=result.data;
          }
          this.isLoading=false;
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
          this.isLoading=false;
        }
      );
  }
  private refresh(){
    this.gridData.data=[];
    this.gridData.total=0;
    this.isLoading=true;
    this.getData();
  }
  private add(){
    this.router.navigate(['add'],{relativeTo:this.route.parent});
  }

  private editRow(id){
    this.router.navigate([id],{relativeTo:this.route.parent});
  }

  private deleteRow(id){
    const dialog: DialogRef = this.dialogService.open({
      title: "确认删除？",
      content: "确定删除吗？",
      actions: [
        { text: "否" },
        { text: "是", primary: true }
      ]
    });

    dialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
        console.log("close");
      } else {

      }
      this.result = result;
      if(this.result.text=='是'){
        this.roleService.delete(id).then(
          data=>{
            let dataObj=this.apiResultService.result(data);
            if(dataObj&&dataObj.status==0){
              dialog.close();
              //this.missionService.change.emit(new AlertData('success','删除成功'));
              this.refresh();
            }
          },
          error=>{
            this.ajaxExceptionService.simpleOp(error);
            dialog.close();
          }
        )
      }
    });
  }


}
