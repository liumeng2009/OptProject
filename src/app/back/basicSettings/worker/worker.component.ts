import {Component,OnInit} from '@angular/core';
import {animation,animate,style,state,transition,trigger,keyframes} from '@angular/animations';

import {User} from '../../../bean/user'
import {WorkerService} from "./worker.service";
import {AjaxExceptionService} from "../../main/ajaxExceptionService";
import {ApiResultService} from "../../main/apiResult.service";
import {SwitchService} from "../../main/switchService";
import {MissionService} from "../../main/mission.service";

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
    private ajaxExceptionService:AjaxExceptionService,
    private switchService:SwitchService,
    private missionService:MissionService
  ){};

  ngOnInit(){
    this.auth();
    this.height=(window.document.body.clientHeight-70-56-50-20-27);
    this.getData();
  }
  //从user对象中，找出对应该页面的auths数组
  private subscription;
  private pageAuths=[];
  private showAddChk:boolean=true;
  private auth(){
    let user=this.switchService.getUser();
    if(user){
      //main组件早已经加载完毕的情况
      this.pageAuths=this.initAuth('worker');
      this.initComponentAuth();
    }
    else{
      //和main组件一同加载的情况
      this.subscription=this.missionService.hasAuth.subscribe(()=>{
        this.pageAuths=this.initAuth('worker');
        this.initComponentAuth();
      });
    }
  }
  private initAuth(functioncode){
    let resultArray=[];
    let user=this.switchService.getUser();
    if(user&&user.role&&user.role.auths){
      let auths=user.role.auths;
      console.log(auths);
      for(let auth of auths){
        if(auth.opInFunc
          &&auth.opInFunc.function
          &&auth.opInFunc.function.code
          &&auth.opInFunc.function.code==functioncode
        ){
          resultArray.push(auth);
        }
      }
    }
    return resultArray;
  }
  //根据auth数组，判断页面一些可操作组件的可用/不可用状态
  private initComponentAuth(){
    let canAdd=false;
    let canDelete=false;
    for(let auth of this.pageAuths){
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='delete'){
        canDelete=true;
      }
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='add'){
        canAdd=true;
      }
    }
    if(!canAdd&&!canDelete){
      this.showAddChk=false;
    }

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
        console.log(data);
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
