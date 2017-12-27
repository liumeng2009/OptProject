import {Component,OnInit} from '@angular/core'
import {animation,animate,style,state,transition,trigger,keyframes} from '@angular/animations';
import {Router,ActivatedRoute} from '@angular/router';

import {DialogService,DialogRef,DialogCloseResult,DialogResult} from '@progress/kendo-angular-dialog';
import {PageChangeEvent,GridDataResult} from '@progress/kendo-angular-grid';

import {User} from '../../../bean/user'
import {OperationService} from "../operations.service";
import {ApiResultService} from "../../main/apiResult.service";
import {AjaxExceptionService} from "../../main/ajaxExceptionService";
import {OptConfig} from "../../../config/config";

@Component({
  selector:'operation_list',
  templateUrl:'./operation_list.component.html',
  styleUrls:['./operation_list.component.scss'],
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

export class OperationListComponent  implements OnInit {

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

  constructor(
    private operationService:OperationService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private dialogService:DialogService
  ){};

  ngOnInit(){
    this.height = (window.document.body.clientHeight - 70 - 56 - 50 - 20-27);
    this.getData(1);
  }
  private getData(pageid){
    this.operationService.getOperationList(pageid)
      .then(
        data=> {
          console.log(data);
          if (this.apiResultService.result(data)) {
            this.gridData.data = this.apiResultService.result(data).data;
            this.total = this.gridData.total = this.apiResultService.result(data).total;
            this.firstRecord = this.skip + 1;
            this.lastRecord = this.apiResultService.result(data).data.length + this.skip;
            //如果actions.length>0 并且有一条action的operationComplete=1，则标志着，工单完结了。
            // complete==0 未处理 complete==1 处理中  complete==2 处理完成 complete=3 已指派
            for(let d of this.gridData.data){
              if(d.actions&&d.actions.length>0){
                if(d.complete){

                }
                else{
                  d.complete='3'
                }
                for(let i=0;i<d.actions.length;i++){
                  if(d.actions[i].start_time){
                    d.complete='1';
                  }
                  if(d.actions[i].operationComplete.toString()=='1'){
                    d.complete='2';
                    break;
                  }
                }
              }
              else{
                d.complete='0'
              }
            }
          }
          this.isLoading = false;
          console.log(this.gridData.data);
        },
        error=> {
          this.ajaxExceptionService.simpleOp(error);
          this.isLoading = false;
        }
      );
  }
  private refresh() {
    this.gridData.data = [];
    this.gridData.total = 0;
    this.isLoading = true;
    this.getData(this.skip / this.pageSize + 1);
  }

  private editRow(id){
      this.router.navigate([id],{relativeTo:this.route.parent});
  }
  private deleteRow(id){
    let dialog=this.dialogService.open({
      title:'确认？',
      content:'确认要删除吗？',
      actions:[
        {text:'否'},
        {text:'是',primary:true}
      ]
    })
    dialog.result.subscribe((result)=>{
      if (result instanceof DialogCloseResult) {

      } else {

      }
      this.result = result;
      if(this.result.text=='是'){
        this.operationService.delete(id).then(
          data=>{
            let result=this.apiResultService.result(data);
            if(result&&result.status==0){
              this.getData(1);
            }
          },
          error=>{
            this.ajaxExceptionService.simpleOp(error);
          }
        )
      }
      else{

      }
    })
  }

  private add(){
    this.router.navigate(['add'],{relativeTo:this.route.parent});
  }

  private pageChange(event,PageChangeEvent){
    this.skip=event.skip;
    this.isLoading=true;
    this.getData(this.skip/this.pageSize+1);
  }

}
