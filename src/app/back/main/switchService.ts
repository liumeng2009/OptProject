import {Injectable} from '@angular/core';



@Injectable()
export class SwitchService {

  private CORP_BUILDING_LIST_AUTO_ADD:boolean=false;
  private ACTION_AUTO_ADD:boolean=false;

  private operationListFilter={
    corp:'',
    create_time:'',
    no:'',
    show_create_time:true
  }

  private orderListFilter={
    create_time:''
  }

  constructor(

  ){

  }

  setCorpBuildingListAutoAdd(bool:boolean){
    this.CORP_BUILDING_LIST_AUTO_ADD=bool;
  }
  getCorpBuildingListAutoAdd(){
    return this.CORP_BUILDING_LIST_AUTO_ADD;
  }
  setActionAutoAdd(bool:boolean){
    this.ACTION_AUTO_ADD=bool;
  }
  getActionAutoAdd(){
    return this.ACTION_AUTO_ADD;
  }

  setOperationListFilter(name:string,value:any){
    for(let p in this.operationListFilter){
      if(name==p.toString()){
        this.operationListFilter[p]=value;
        break;
      }
    }
  }

  getOperationListFilter(name:string){
    for(let p in this.operationListFilter){
      if(name==p.toString()){
        return this.operationListFilter[p];
      }
    }
    return null;
  }

  setOrderListFilter(name:string,value:string){
    for(let p in this.orderListFilter){
      if(name==p.toString()){
        this.orderListFilter[p]=value;
      }
    }
  }

  getOrderListFilter(name:string){
    for(let p in this.orderListFilter){
      if(name==p.toString()){
        return this.orderListFilter[p];
      }
    }
    return null;
  }
}
