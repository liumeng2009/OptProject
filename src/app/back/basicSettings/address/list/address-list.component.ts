import {Component,OnInit,Output,EventEmitter} from '@angular/core';
import {animation,animate,style,state,transition,trigger,keyframes} from '@angular/animations';
import {Router,ActivatedRoute} from '@angular/router';

import {PageChangeEvent,GridDataResult} from '@progress/kendo-angular-grid';
import {DialogService,DialogRef,DialogCloseResult,DialogResult} from '@progress/kendo-angular-dialog';

import {AddressService} from '../address.service';


import {AlertData} from '../../../../bean/alertData'

import {OptConfig} from '../../../../config/config';

import {MissionService} from '../../../main/mission.service';
import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from "../../../main/ajaxExceptionService";
import {ResultFunc} from "rxjs/observable/GenerateObservable";
import {SwitchService} from "../../../main/switchService";


@Component({
  selector:'address-list',
  templateUrl:'./address-list.component.html',
  styleUrls:['./address-list.component.scss'],
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
  private result;
  private isLoading:boolean=true;

  constructor(
    private addressService:AddressService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private dialogService:DialogService,
    private missionService:MissionService,
    private switchService:SwitchService
  ){};

  ngOnInit(){
    this.auth();
    this.height=(window.document.body.clientHeight-70-56-50-27);
    this.getData(1);
  }

  //从user对象中，找出对应该页面的auths数组
  private subscription;
  private pageAuths=[];
  private showAddBtn:boolean=false;
  private showListEditBtn:boolean=false;
  private showListDeleteBtn:boolean=false;
  private auth(){
    let user=this.switchService.getUser();
    if(user){
      //main组件早已经加载完毕的情况
      this.pageAuths=this.initAuth('address');
      this.initComponentAuth();
    }
    else{
      //和main组件一同加载的情况
      this.subscription=this.missionService.hasAuth.subscribe(()=>{
        this.pageAuths=this.initAuth('address');
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
    for(let auth of this.pageAuths){
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='add'){
        this.showAddBtn=true;
      }
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='edit'){
        this.showListEditBtn=true;
      }
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='delete'){
        this.showListDeleteBtn=true;
      }
    }
  }

  private getData(pageid){
    this.addressService.getAddressList(pageid)
      .then(
        data=>{
          if(this.apiResultService.result(data)){
            this.gridData.data=this.apiResultService.result(data).data;
            this.total=this.gridData.total=this.apiResultService.result(data).total;
            this.firstRecord=this.skip+1;
            this.lastRecord=this.apiResultService.result(data).data.length+this.skip;
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
    this.getData(this.skip/this.pageSize);
  }

  private pageAuth(){
    let pageAuthCode='address';

  }

  private add(){
    this.router.navigate(['add'],{relativeTo:this.route.parent});
  }

  private pageChange(event,PageChangeEvent){
    this.skip=event.skip;
    this.isLoading=true;
    this.getData(this.skip/this.pageSize+1);
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

      } else {

      }
      this.result = result;
      if(this.result.text=='是'){
        this.addressService.delete(id).then(
          data=>{
            let dataObj=this.apiResultService.result(data);
            if(dataObj&&dataObj.status==0){
              dialog.close();
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
