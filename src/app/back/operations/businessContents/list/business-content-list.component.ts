import {Component,OnInit,ElementRef,HostListener,ViewEncapsulation,ViewChild } from '@angular/core';
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
import {Position} from "../../../../bean/position";
import {EquipType} from "../../../../bean/equipType";
import {EquipOp} from "../../../../bean/equipOp";

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

  private height:number=0;
  private pageSize:number=new OptConfig().pageSize;
  private skip:number=0;
  private total:number=0;
  private firstRecord:number=0;
  private lastRecord:number=0;
  private result;
  private isLoading:boolean=false;

  private searchTypeName:EquipType[]=[];
  private searchEquipment:Position[]=[];

  private searchObj={
    type:{name:null,code:''},
    equipment:{name:null,value:''}
  }

  public filter: CompositeFilterDescriptor;

  constructor(
    private businessContentService:BusinessContentService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private dialogService:DialogService
  ){

  };

  private subs;
  ngOnInit(){
    this.height=(window.document.body.clientHeight-70-56-50-20-27);

    //获取参数
    let urlTree=this.router.parseUrl(this.router.url);
    let queryParams=urlTree.queryParams;
    let page=1;
    try{
      page=parseInt(queryParams.page?queryParams.page:'1')
    }
    catch(e){

    }
    let type=queryParams.type;
    let equipment=queryParams.equipment;

    this.getSearchEquipment(type);
    this.getEquipTypeList(type);
    this.getEquipOpList();

    console.log('init');
    this.getData(page,type,equipment);
    this.skip=(page-1)*this.pageSize;

    this.subs=this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.initQueryParams();
        }
      });

  }

  ngOnDestroy(){
    this.subs.unsubscribe();
  }

  private initQueryParams(){
    //获取参数
    let urlTree=this.router.parseUrl(this.router.url);
    let queryParams=urlTree.queryParams;
    let page=1;
    try{
      page=parseInt(queryParams.page?queryParams.page:'1')
    }
    catch(e){

    }
    let type=queryParams.type?queryParams.type:'';
    let equipment=queryParams.equipment?queryParams.equipment:'';
    this.getData(page,type,equipment);
    this.skip=(page-1)*this.pageSize;
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
    this.getData(this.skip/this.pageSize+1,this.searchObj.type.code,this.searchObj.equipment.value);
  }
  private add(){
    this.router.navigate(['add'],{relativeTo:this.route.parent});
  }

  private pageChange(event,PageChangeEvent){
    this.skip=event.skip;
    this.isLoading=true;
    //this.router.navigate(['list/'+(this.skip/this.pageSize+1).toString()],{relativeTo:this.route.parent})
    //this.router.navigate([{'page':(this.skip/this.pageSize+1).toString()}],{relativeTo:this.route})
    //this.getData(this.skip/this.pageSize+1,this.searchObj.type.code,this.searchObj.equipment.value);
    this.router.navigate(['list'],{queryParams:{page:(this.skip/this.pageSize+1).toString()},relativeTo:this.route.parent});
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
    let urlTree=this.router.parseUrl(this.router.url);
    let queryParams=urlTree.queryParams;
    queryParams.type=e.code;
    this.getSearchEquipment(e.code);
    //this.searchObj.equipment=this.searchEquipment[0]?this.searchEquipment[0]:null;
    queryParams.equipment=this.searchEquipment[0]?this.searchEquipment[0].value:null;
    this.router.navigate(['list'],{queryParams:queryParams,relativeTo:this.route.parent});

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

  private handleEquimentChange(e){

    let urlTree=this.router.parseUrl(this.router.url);
    let queryParams=urlTree.queryParams;
    queryParams.equipment=e.value;
    this.router.navigate(['list'],{queryParams:queryParams,relativeTo:this.route.parent});

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

  private getSearchEquipment(type:string){
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
          this.searchObj.equipment=this.searchEquipment[0];
        }
        //console.log(this.searchEquipment);
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
          this.getEquipTypeList(queryParams.type);
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
  private getEquipTypeList(type){
    this.equiptypes.splice(0,this.equiptypes.length);
    this.businessContentService.getType().then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0&&result.data.length>0){
          for(let d of result.data){
            let et=new EquipType(d.id,d.name,d.code);
            if(d.code==type){
              this.searchObj.type=et;
            }
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
              this.getEquipTypeList(queryParams.type);
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
