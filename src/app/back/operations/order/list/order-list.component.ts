import {Component,OnInit,ElementRef,HostListener,ViewEncapsulation,ViewChild} from '@angular/core';
import {animation,animate,style,state,transition,trigger,keyframes} from '@angular/animations';
import {Router,ActivatedRoute} from '@angular/router';

import {PageChangeEvent,GridDataResult} from '@progress/kendo-angular-grid';
import {DialogService,DialogRef,DialogCloseResult,DialogResult} from '@progress/kendo-angular-dialog';
import { filterBy, FilterDescriptor, CompositeFilterDescriptor } from '@progress/kendo-data-query';

import {OrderService} from "../order.service";
import {ApiResultService} from "../../../main/apiResult.service";
import {AjaxExceptionService} from "../../../main/ajaxExceptionService";
import {OptConfig} from "../../../../config/config";
import {Position} from "../../../../bean/position";
import {SwitchService} from "../../../main/switchService";

@Component({
  selector:'order-list',
  templateUrl:'./order-list.component.html',
  styleUrls:['./order-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
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

export class OrderListComponent implements OnInit {

  private gridData:GridDataResult = {
    data: [],
    total: 0
  };

  private height:number = 0;
  private pageSize:number = new OptConfig().pageSize;
  private skip:number = 0;
  private total:number = 0;
  private firstRecord:number = 0;
  private lastRecord:number = 0;
  private result;
  private isLoading:boolean = true;
  public filter: CompositeFilterDescriptor;
  private todayFilter:Date=new Date();
  private showTodayFilter:boolean=true;

  constructor(private orderService:OrderService,
              private router:Router,
              private route:ActivatedRoute,
              private apiResultService:ApiResultService,
              private ajaxExceptionService:AjaxExceptionService,
              private dialogService:DialogService,
              private switchService:SwitchService

  ) {

  };

  ngOnInit() {
    this.height = (window.document.body.clientHeight - 70 - 56 - 50 - 20-27);
    this.initFilter();
    this.getData(1,this.todayFilter);
  }

  private initFilter(){
    let filter=this.switchService.getOrderListFilter('create_time');
    if(filter&&filter!=''){
      this.todayFilter=new Date(filter.toString());
    }

    let showfilter=this.switchService.getOrderListFilter('show_create_time');
    if(showfilter&&showfilter!=''){
      this.showTodayFilter=showfilter;
    }
  }

  private getData(pageid,time) {
    let d;
    if(time){
      let dateSubmit=new Date(time.toString());
      d=dateSubmit.getTime();
    }
    this.orderService.getOrderList(pageid,d)
      .then(
        data=> {
          if (this.apiResultService.result(data)) {
            this.gridData.data = this.apiResultService.result(data).data;
            this.total = this.gridData.total = this.apiResultService.result(data).total;
            this.firstRecord = this.skip + 1;
            this.lastRecord = this.apiResultService.result(data).data.length + this.skip;
          }
          this.isLoading = false;
        },
        error=> {
          this.ajaxExceptionService.simpleOp(error);
          this.isLoading = false;
        }
      );
  }

  private dateFilterChange($event){
    this.switchService.setOrderListFilter('create_time',$event);
    this.todayFilter=new Date($event);
    this.getData(1,this.todayFilter);
  }

  private searchDateChange($event){
    let bol=$event.target.checked;
    if(bol){
      this.showTodayFilter=true;
      this.switchService.setOrderListFilter('show_create_time',true);
      this.getData( 1,this.showTodayFilter?this.todayFilter:null);
    }
    else{
      this.showTodayFilter=false;
      this.switchService.setOrderListFilter('show_create_time',false);
      this.getData( 1,this.showTodayFilter?this.todayFilter:null);
    }
  }


  private refresh() {
    this.gridData.data = [];
    this.gridData.total = 0;
    this.isLoading = true;
    this.getData(this.skip / this.pageSize + 1,this.todayFilter);
  }

  private add() {
    this.router.navigate(['add'], {relativeTo: this.route.parent});
  }

  private pageChange(event, PageChangeEvent) {
    this.skip = event.skip;
    this.isLoading = true;
    this.getData(this.skip / this.pageSize + 1,this.todayFilter);
  }

  private editRow(id) {
    this.router.navigate([id], {relativeTo: this.route.parent});
  }

  private deleteRow(id) {
    const dialog:DialogRef = this.dialogService.open({
      title: "确认删除？",
      content: "确定删除吗？",
      actions: [
        {text: "否"},
        {text: "是", primary: true}
      ]
    });

    dialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {

      } else {

      }
      this.result = result;
      if (this.result.text == '是') {
        this.orderService.delete(id).then(
          data=> {
            let result = this.apiResultService.result(data);
            if (result && result.status == 0) {
              dialog.close();
              this.refresh();
            }
          },
          error=> {
            this.ajaxExceptionService.simpleOp(error);
          }
        )
      }
    });
  }


}
