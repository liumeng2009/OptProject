import {Component,OnInit,ElementRef,HostListener,ViewEncapsulation,ViewChild } from '@angular/core';
import {animation,animate,style,state,transition,trigger,keyframes} from '@angular/animations';
import {Router,ActivatedRoute,Params,NavigationEnd } from '@angular/router';

import {PageChangeEvent,GridDataResult} from '@progress/kendo-angular-grid';
import {DialogService,DialogRef,DialogCloseResult,DialogResult} from '@progress/kendo-angular-dialog';
import { filterBy, FilterDescriptor, CompositeFilterDescriptor } from '@progress/kendo-data-query';
import {
  PopupService,
  PopupRef
} from '@progress/kendo-angular-popup';

import {BusinessContentService} from "../businessContent.service";
import {ApiResultService} from "../../../main/apiResult.service";
import {AjaxExceptionService} from "../../../main/ajaxExceptionService";
import {OptConfig} from "../../../../config/config";
import {EquipType} from "../../../../bean/equipType";
import {EquipOp} from "../../../../bean/equipOp";
import {SwitchService} from "../../../main/switchService";
import {Position} from "../../../../bean/position";

@Component({
  selector:'business-list',
  templateUrl:'./business-content-list.component.html',
  styleUrls:['./business-content-list.component.scss'],
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

export class BusinessContentListComponent implements OnInit{

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
  private isLoading:boolean=false;

  private searchEquipment:Position[]=[];

  private searchObj={
    type:'',
    equipment:null,
    page:1
  }

  public filter: CompositeFilterDescriptor;

  constructor(
    private businessContentService:BusinessContentService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private dialogService:DialogService,
    private switchService:SwitchService
  ){

  };

  ngOnInit(){

    this.height=(window.document.body.clientHeight-70-56-50-20-27);

    this.initFilter();

    this.getEquipTypeList();
    this.getSearchEquipment(this.searchObj.type,()=>{
      this.getData(this.searchObj.page,this.searchObj.type,this.searchObj.equipment.value);
    },true);
    this.getEquipOpList();
  }


  private initFilter(){
    let typeFilter=this.switchService.getBusinessListFilter('type');
    if(typeFilter&&typeFilter!=''){
      this.searchObj.type=typeFilter;
    }

    let equipmentFilter=this.switchService.getBusinessListFilter('equipment');
    if(equipmentFilter&&equipmentFilter!=''){
      this.searchObj.equipment=equipmentFilter;
    }

    let page=this.switchService.getBusinessListFilter('page');
    if(page&&page!=''){
      this.searchObj.page=page;
    }

  }

  private getData(pageid,type,equipment){
    this.isLoading=true;
    this.businessContentService.getBusinessContentList(pageid,type,equipment)
      .then(
        data=>{
          console.log(data);
          if(this.apiResultService.result(data)) {
            this.gridData.data = this.apiResultService.result(data).data;
            this.total = this.gridData.total = this.apiResultService.result(data).total;
            this.skip=this.pageSize*(pageid-1);
            this.firstRecord=this.pageSize*(pageid-1)+1;
            this.lastRecord=this.apiResultService.result(data).data.length+this.pageSize*(pageid-1);
          }
          this.isLoading=false;

          console.log(this.searchEquipment);
          console.log(this.equiptypesFilter);
          console.log(this.searchObj);
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
    this.getData(this.skip/this.pageSize+1,this.searchObj.type,this.searchObj.equipment.value);
  }
  private add(){
    this.router.navigate(['add'],{relativeTo:this.route.parent});
  }

  private pageChange(event,PageChangeEvent){
    this.skip=event.skip;
    this.isLoading=true;
    this.switchService.setBusinessListFilter('page',this.skip/this.pageSize+1);
    this.getData(this.skip/this.pageSize+1,this.searchObj.type,this.searchObj.equipment.value);
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
    this.dialogShow=true;

    dialog.result.subscribe((result) => {
      setTimeout(()=>{this.dialogShow=false},1000);
      if (result instanceof DialogCloseResult) {

      } else {

      }
      this.result = result;
      if(this.result.text=='是'){
        this.businessContentService.delete(id).then(
          data=>{
            let result=this.apiResultService.result(data);
            if(result&&result.status==0){
              dialog.close();
              this.refresh();
            }
          },
          error=>{
            this.ajaxExceptionService.simpleOp(error);
          }
        )
      }
    });
  }


  private handleTypeChange(e){
    this.switchService.setBusinessListFilter('type',e);
    this.switchService.setBusinessListFilter('page',1);
    this.getSearchEquipment(e,()=>{
      this.getData(1,this.searchObj.type,this.searchObj.equipment.value);
    },false);

    //this.searchObj.equipment=this.searchEquipment[0]?this.searchEquipment[0]:null;
    //queryParams.equipment=this.searchEquipment[0]?this.searchEquipment[0].value:null;
    //this.router.navigate(['list'],{queryParams:queryParams,relativeTo:this.route.parent});

/*    this.businessContentService.getBusinessContentList(1,this.searchObj.type.code,this.searchObj.equipment.value).then(
      data=>{
        if(this.apiResultService.result(data)) {
          this.gridData.data = this.apiResultService.result(data).data;
          this.total = this.gridData.total = this.apiResultService.result(data).total;
          this.skip=0;
          this.firstRecord=this.skip+1;
          this.lastRecord=this.apiResultService.result(data).data.length+this.skip;
        }
        this.isLoading=false;
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
        this.isLoading=false;
      }
    );*/
  }

  private handleEquipmentChange(e){
    this.switchService.setBusinessListFilter('equipment',e.value);
    this.switchService.setBusinessListFilter('page',1);
    //this.router.navigate(['list'],{queryParams:queryParams,relativeTo:this.route.parent});
    this.getData(1,this.searchObj.type,this.searchObj.equipment.value);
/*    this.businessContentService.getBusinessContentList(1,this.searchObj.type.code,this.searchObj.equipment.value).then(
      data=>{
        if(this.apiResultService.result(data)) {
          this.gridData.data = this.apiResultService.result(data).data;
          this.total = this.gridData.total = this.apiResultService.result(data).total;
          this.skip=0;
          this.firstRecord=this.skip+1;
          this.lastRecord=this.apiResultService.result(data).data.length+this.skip;
        }
        this.isLoading=false;
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
        this.isLoading=false;
      }
    );*/
  }

  private getSearchEquipment(type:string,callback,isInitPage:boolean){
    this.searchEquipment.splice(0,this.searchEquipment.length);
    this.searchEquipment.push(new Position('全部设备',''));
    this.businessContentService.getEquipment(type).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          for(let d of this.apiResultService.result(data).data){
            this.searchEquipment.push(new Position(d.equipment,d.equipment));
          }
        }
        if(this.searchEquipment.length>0){
          if(isInitPage){
            if(this.searchObj.equipment&&this.searchObj.equipment!=''){
              for(let se of this.searchEquipment){
                if(se.value==this.searchObj.equipment){
                  this.searchObj.equipment=se;
                  break;
                }
              }
            }
            else{
              this.searchObj.equipment=this.searchEquipment[0];

            }

          }
          else{

          }
          //if(this.searchObj.equipment&&this.searchObj.equipment!='')
          {

          }
          //else{

          //}
        }
        callback();
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private show:boolean=false;
  private configTypeToggle(show){
    if(show==undefined){
      if(this.show){
        this.show=false;
      }
      else{
        this.show=true;
      }
    }
    else{
      this.show=show;
    }
  }

  private showOp:boolean=false;
  private configOpToggle(show){
    if(show==undefined){
      if(this.showOp){
        this.showOp=false;
      }
      else{
        this.showOp=true;
      }
    }
    else{
      this.showOp=show;
    }
  }

  private dialogShow:boolean=false;
  @ViewChild('anchor') public anchor: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popup: ElementRef;
  private contains(target: any): boolean {
    return this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target): false)||this.dialogShow;
  }

  @ViewChild('anchorOp') public anchorOp: ElementRef;
  @ViewChild('popupOp', { read: ElementRef }) public popupOp: ElementRef;
  private containsOp(target: any): boolean {
    return this.anchorOp.nativeElement.contains(target) ||
      (this.popupOp ? this.popupOp.nativeElement.contains(target): false)||this.dialogShow;
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.configTypeToggle(false);
    }
    if (!this.containsOp(event.target)) {
      this.configOpToggle(false);
    }
  }

  private equiptype=new EquipType(null,null,null);
  private equiptypes:EquipType[]=[];
  private equiptypesFilter:EquipType[]=[];

  private savetype(){
    let urlTree=this.router.parseUrl(this.router.url);
    let queryParams=urlTree.queryParams;
    this.businessContentService.createType(this.equiptype).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result.status==0){
          this.getEquipTypeList();
          this.equiptype.name=null;
          this.equiptype.code=null;
          this.configTypeToggle(false);
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private equipop=new EquipOp(null,null,null);
  private saveop(){
    console.log(this.equipop);
    this.businessContentService.createOp(this.equipop).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result.status==0){
          this.getEquipOpList();
          this.equipop.name=null;
          this.equipop.code=null;
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }
  private getEquipTypeList(){
    this.equiptypes.splice(0,this.equiptypes.length);
    this.businessContentService.getType().then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0&&result.data.length>0){
          for(let d of result.data){
            let et=new EquipType(d.id,d.name,d.code);
            this.equiptypes.push(et);
          }
        }
        let spAll=new EquipType('','全部类型','');
        this.equiptypesFilter=this.equiptypes.slice(0);
        this.equiptypesFilter.splice(0,0,spAll);
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }
  private equipops:EquipOp[]=[];
  private getEquipOpList(){
    this.equipops.splice(0,this.equipops.length);
    this.businessContentService.getOp().then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0&&result.data.length>0){
          for(let d of result.data){
            let eo=new EquipOp(d.id,d.name,d.code);
            this.equipops.push(eo);
          }
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

  private deletetype(id){
    const dialog: DialogRef = this.dialogService.open({
      title: "确认删除？",
      content: "确定删除吗？",
      actions: [
        { text: "否" },
        { text: "是", primary: true }
      ]
    });

    this.dialogShow=true;
    let urlTree=this.router.parseUrl(this.router.url);
    let queryParams=urlTree.queryParams;
    dialog.result.subscribe((result) => {
      setTimeout(()=>{this.dialogShow=false},1000);
      if (result instanceof DialogCloseResult) {
        console.log("close");
      } else {

      }
      this.result = result;
      if(this.result.text=='是'){
        this.businessContentService.deletetype(id).then(
          data=>{
            let result=this.apiResultService.result(data);
            if(result.status==0){
              this.getEquipTypeList();
            }
          },
          error=>{
            this.ajaxExceptionService.simpleOp(error);
          }
        );
      }
    });
  }
  private deleteop(id){
    const dialog: DialogRef = this.dialogService.open({
      title: "确认删除？",
      content: "确定删除吗？",
      actions: [
        { text: "否" },
        { text: "是", primary: true }
      ]
    });

    this.dialogShow=true;

    dialog.result.subscribe((result) => {
      setTimeout(()=>{this.dialogShow=false},1000);
      if (result instanceof DialogCloseResult) {
        console.log("close");
      } else {

      }
      this.result = result;
      if(this.result.text=='是'){
        this.businessContentService.deleteop(id).then(
          data=>{
            let result=this.apiResultService.result(data);
            if(result.status==0){
              this.getEquipOpList();
            }
          },
          error=>{
            this.ajaxExceptionService.simpleOp(error);
          }
        );
      }
    });
  }
  private cleartypeform(){
    this.equiptype.name=null;
    this.equiptype.code=null;
  }
  private clearopform(){
    this.equipop.name=null;
    this.equipop.code=null;
  }
}
