import {Component,OnInit} from '@angular/core';

import {User} from '../../../bean/user'
import {WorkerService} from "./worker.service";
import {AjaxExceptionService} from "../../main/ajaxExceptionService";
import {ApiResultService} from "../../main/apiResult.service";

@Component({
  selector:'worker',
  templateUrl:'./worker.component.html',
  styleUrls:['./worker.component.scss']
})

export class WorkerComponent implements OnInit{

  private height=0;
  private workers;

  private isLoading:boolean=true;

  private gridData=[
    {
      "ProductID": 1,
      "ProductName": "Chai",
      "SupplierID": 1,
      "CategoryID": 1,
      "QuantityPerUnit": "10 boxes x 20 bags",
      "UnitPrice": 18,
      "UnitsInStock": 39,
      "UnitsOnOrder": 0,
      "ReorderLevel": 10,
      "Discontinued": false,
      "Category": {
        "CategoryID": 1,
        "CategoryName": "Beverages",
        "Description": "Soft drinks, coffees, teas, beers, and ales"
      },
      "FirstOrderedOn": new Date(1996, 8, 20)
    },
  ]

  constructor(
    private workerService:WorkerService,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService
  ){};

  ngOnInit(){
    this.height=(window.document.body.clientHeight-70-56-50-20);
    this.getData();
  }
  getData(){
    this.workerService.getWorkerList(null).then(
      data=>{
        this.isLoading=false;
        if(this.apiResultService.result(data)) {
          this.workers = this.apiResultService.result(data).data;
        }
      },
      error=>{
        this.isLoading=false;
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  addWorker(userId){
    this.workerService.create(userId).then(
      data=>{
        this.apiResultService.result(data);
        this.getData();
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
        this.getData();
      }
    );
  }

  refresh(){
    this.getData();
  }

  removeWorker(userId){
    this.workerService.delete(userId).then(
      data=>{
        this.apiResultService.result(data);
        this.getData();
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
        this.getData();
      }
    );
  }

  clickChange(event){
    let checked=event.target.checked;
    let id=event.target.id;
    if(checked){
      this.addWorker(id);
    }
    else{
      this.removeWorker(id);
    }

  }

}
