import {Injectable} from '@angular/core';



@Injectable()
export class SwitchService {

  private CORP_BUILDING_LIST_AUTO_ADD:boolean=false;
  private ACTION_AUTO_ADD:boolean=false;
  private USER:any=null;
  //进入main之后，toast才可以生效，当没有进入main组件时，请求的路由就被守卫拦住了，这时就不走main组件
  private IS_INTO_MAIN_COMPONENT:boolean=false;

  private operationListFilter={
    corp:'',
    create_time:'',
    no:'',
    page:0,
    show_create_time:true
  }

  private orderListFilter={
    create_time:'',
    show_create_time:true
  }

  private businessListFilter={
    type:'',
    equipment:'',
    page:1
  }

  constructor(

  ){

  }

  setUser(user:any){
    this.USER=user;
  }
  getUser(){
    return this.USER;
  }

  setIsIntoMain(isInto:any){
    this.IS_INTO_MAIN_COMPONENT=isInto;
  }
  getIsIntoMain(){
    return this.IS_INTO_MAIN_COMPONENT;
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

  setOrderListFilter(name:string,value:any){
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

  setBusinessListFilter(name:string,value:any){
    for(let p in this.businessListFilter){
      if(name==p.toString()){
        this.businessListFilter[p]=value;
      }
    }
  }

  getBusinessListFilter(name:string){
    for(let p in this.businessListFilter){
      if(name==p.toString()){
        return this.businessListFilter[p];
      }
    }
    return null;
  }

}
