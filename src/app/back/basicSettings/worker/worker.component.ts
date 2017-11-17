import {Component,OnInit} from '@angular/core';
import {animation,animate,style,state,transition,trigger,keyframes} from '@angular/animations';

import {User} from '../../../bean/user'
import {WorkerService} from "./worker.service";
import {AjaxExceptionService} from "../../main/ajaxExceptionService";
import {ApiResultService} from "../../main/apiResult.service";

@Component({
  selector:'worker',
  templateUrl:'./worker.component.html',
  styleUrls:['./worker.component.scss'],
  animations: [ // 动画的内容
    trigger('pageChanged', [
      // state 控制不同的状态下对应的不同的样式
      state('in', style({ opacity:1, transform: 'translateX(0%)' })),
      // transition 控制状态到状态以什么样的方式来进行转换
      transition('void=>*', animate('600ms ease-in-out',keyframes([
        style({  opacity: 0, transform: 'translateX(-100%)' }),
        style({ opacity: 1, transform: 'translateX(0%)' })
      ]))),
      transition('*=>void', animate('300ms',keyframes([
        style({  opacity: 1, transform: 'translateX(-0%)' }),
        style({ opacity: 0, transform: 'translateX(-100%)' })
      ]))),
    ])
  ]
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
    this.height=(window.document.body.clientHeight-70-56-50-20-27);
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
