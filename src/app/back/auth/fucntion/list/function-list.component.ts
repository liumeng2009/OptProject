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
    this.height=(window.document.body.clientHeight-70-56-50-20-27);
    this.getData();
  }

  private getData(){
    this.isLoading=true;
    this.functionService.getList()
      .then(
        data=>{
          let functionResult=this.apiResultService.result(data);
          if(functionResult&&functionResult.status==0){
            let functions = this.apiResultService.result(data).data;
            this.functionService.getOpList().then(
              data=>{
                let result=this.apiResultService.result(data);
                if(result&&result.status==0){
                  let operates=result.data;
                  //根据operates改造functionList
                  for(let f of functions){
                    let array2=[];
                    for(let os of operates){
                      let newObj={};
                      for(let p in os){
                        newObj[p]=os[p];
                      }
                      array2.push(newObj);
                    }
                    f.viewOp=array2;

                    for(let vo of f.viewOp){
                      vo.checked=this.isExistInArray(vo.id,f.ops);
                      console.log(vo);
                    }
                  }
                  this.gridData.data=functions;
                  console.log(this.gridData.data);
                  this.isLoading=false;
                }
              },
              error=>{
                this.isLoading=false;
                this.ajaxExceptionService.simpleOp(error);
              }
            )
          }
          this.isLoading=false;
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
          this.isLoading=false;
        }
      );
  }

  private isExistInArray(id,array){
    let i=0;
    for(let a of array){
      if(id==a.opId){
        return true;
      }
      else{
        if(i==array.length-1){
          return false;
        }
      }
      i++;
    }
    return false;
  }

  private opChange($event,opId,funcId,dataObj){
    let chk=$event.target.checked;
    if(chk){
      this.functionService.createAuth({funcId:funcId,opId:opId}).then(
        data=>{
          let result=this.apiResultService.result(data);
          if(result&&result.status===0){

          }
          else{
            dataObj.checked=false;
          }
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
          dataObj.checked=false;
        }
      )
    }
    else{
      this.functionService.deleteAuth({funcId:funcId,opId:opId}).then(
        data=>{
          let result=this.apiResultService.result(data);
          if(result&&result.status===0){

          }
          else{
            dataObj.checked=true;
          }
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
          dataObj.checked=true;
        }
      )
    }

  }

  private refresh(){
    this.gridData.data=[];
    this.gridData.total=0;
    this.isLoading=true;
    this.getData();
  }
}
