import {Component,OnInit,ElementRef,HostListener,ViewEncapsulation,ViewChild } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

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
import {Position} from "../../../../bean/position";
import {EquipType} from "../../../../bean/equipType";

@Component({
  selector:'business-list',
  templateUrl:'./business-content-list.component.html',
  styleUrls:['./business-content-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BusinessContentListComponent implements OnInit{

  private gridData:GridDataResult={
    data:[],
    total:0
  };

  private show:boolean=false;

  private height:number=0;
  private pageSize:number=new OptConfig().pageSize;
  private skip:number=0;
  private total:number=0;
  private firstRecord:number=0;
  private lastRecord:number=0;
  private result;
  private isLoading:boolean=true;

  private operationName:Position[]=[];
  private typeName:Position[]=[];

  private searchTypeName:Position[]=[];
  private searchEquipment:Position[]=[];

  private searchObj={
    type:{name:null,value:''},
    equipment:{name:null,value:''}
  }

  public filter: CompositeFilterDescriptor;

  constructor(
    private businessContentService:BusinessContentService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private dialogService:DialogService,
    private popService:PopupService
  ){
    let gSET=new Position('安装','SETUP');
    let gDE=new Position('调试','DEBUG');
    let gFIX=new Position('修复','FIX');
    let gADV=new Position('咨询','ADVICE');
    let gSUP=new Position('现场技术支持','SUPPORT');
    this.operationName.push(gSET);
    this.operationName.push(gDE);
    this.operationName.push(gFIX);
    this.operationName.push(gADV);
    this.operationName.push(gSUP);

    let pNET=new Position('网络','NET');
    let pHW=new Position('硬件','HARDWARE');
    let pSW=new Position('软件','SOFTWARE');
    let pSYS=new Position('系统','SYSTEM');
    let pOT=new Position('其他','OTHER');
    this.typeName.push(pNET);
    this.typeName.push(pHW);
    this.typeName.push(pSW);
    this.typeName.push(pSYS);
    this.typeName.push(pOT);

    let spNET=new Position('网络','NET');
    let spHW=new Position('硬件','HARDWARE');
    let spSW=new Position('软件','SOFTWARE');
    let spSYS=new Position('系统','SYSTEM');
    let spOT=new Position('其他','OTHER');
    let spAll=new Position('全部类型','');
    this.searchTypeName.push(spAll);
    this.searchTypeName.push(spNET);
    this.searchTypeName.push(spHW);
    this.searchTypeName.push(spSW);
    this.searchTypeName.push(spSYS);
    this.searchTypeName.push(spOT);

  };

  ngOnInit(){
    this.height=(window.document.body.clientHeight-70-56-50-20);
    this.getData(1,this.searchObj.type.value,this.searchObj.equipment.value);
    this.getSearchEquipment(this.searchObj.type.value);
  }

  private getData(pageid,type,equipment){
    this.businessContentService.getBusinessContentList(pageid,type,equipment)
      .then(
        data=>{
          if(this.apiResultService.result(data)) {
            this.gridData.data = this.apiResultService.result(data).data;
            this.total = this.gridData.total = this.apiResultService.result(data).total;
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
    this.getData(this.skip/this.pageSize+1,this.searchObj.type.value,this.searchObj.equipment.value);
  }
  private add(){
    this.router.navigate(['add'],{relativeTo:this.route.parent});
  }

  private pageChange(event,PageChangeEvent){
    this.skip=event.skip;
    this.isLoading=true;
    this.getData(this.skip/this.pageSize+1,this.searchObj.type.value,this.searchObj.equipment.value);
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
    this.getSearchEquipment(this.searchObj.type.value);
    this.searchObj.equipment=this.searchEquipment[0]?this.searchEquipment[0]:null;

    this.businessContentService.getBusinessContentList(1,this.searchObj.type.value,this.searchObj.equipment.value).then(
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
    );
  }

  private handleEquimentChange(e){
    this.businessContentService.getBusinessContentList(1,this.searchObj.type.value,this.searchObj.equipment.value).then(
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
    );
  }

  private getSearchEquipment(type:string){
    this.searchEquipment.splice(0,this.searchTypeName.length);
    this.searchEquipment.push(new Position('全部设备',''));
    this.businessContentService.getEquipment(type).then(
      data=>{
        if(this.apiResultService.result(data).status==0){
          for(let d of this.apiResultService.result(data).data){
            this.searchEquipment.push(new Position(d.equipment,d.equipment));
          }
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private configTypeToggle(show){
    if(show!=undefined){
      this.show=show;
    }
    else{
      if(this.show){
        this.show=false;
      }
      else{
        this.show=true;
      }
    }
  }

  @ViewChild('anchor') public anchor: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popup: ElementRef;
  private contains(target: any): boolean {
    return this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target): false);
  }
  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.configTypeToggle(false);
    }
  }

  private equiptype=new EquipType(null,null,null);
  private equiptypes:EquipType[]=[];

  private savetype(){
    this.businessContentService.createType(this.equiptype).then(
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
  private getEquipTypeList(){
    this.businessContentService.getType().then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result.status==0&&result.data.length>0){
          for(let d of result.data){
            let et=new EquipType(d.id,d.name,d.code);
            this.equiptypes.push(et);
          }
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }

}
