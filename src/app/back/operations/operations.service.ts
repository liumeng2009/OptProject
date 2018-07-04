import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../bean/responseData';

import {OptConfig} from '../../config/config'

import {User} from '../../bean/user';
import {WorkOrder} from "../../bean/workOrder";


@Injectable()
export class OperationService{
  private headers = new Headers({'Content-Type': 'application/json'});

  private listurl=new OptConfig().serverPath+'/api/operation/list';
  private geturl=new OptConfig().serverPath+'/api/operation';
  private saveurl=new OptConfig().serverPath+'/api/operation/save';
  private editurl=new OptConfig().serverPath+'/api/operation/edit';
  private deleteurl=new OptConfig().serverPath+'/api/operation/delete';

  private saveactionurl=new OptConfig().serverPath+'/api/action/add';
  private editactionurl=new OptConfig().serverPath+'/api/action/edit';
  private deleteactionurl=new OptConfig().serverPath+'/api/action/delete';

  constructor(private http:Http,private cookieService:CookieService){
    let token=this.cookieService.get('optToken');
    this.headers== new Headers({'Content-Type': 'application/json','authorization':token});
  }

  getOperationList(pageid,time,corp,no):Promise<ResponseData>{
    let url='';
    let searchStr='/time/'+(time?time:'0')+'/corp/'+(corp?corp:'0')+'/no/'+(no?no:'0')
    if(pageid){
      url=this.listurl+'/page/'+pageid+searchStr
    }
    else{
      url=this.listurl+searchStr
    }
    console.log(url);
    return this.http.get(url,{headers:this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  getOperation(id):Promise<ResponseData>{
    let url=this.geturl+'/'+id
    return this.http.get(url,{headers:this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  create(operation:WorkOrder): Promise<ResponseData> {
    return this.http
      .post(this.saveurl, operation, {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  edit(operation:WorkOrder):Promise<ResponseData> {
    return this.http
      .post(this.editurl, operation, {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  delete(id:string):Promise<ResponseData> {
    return this.http
      .get(this.deleteurl+'/'+id,{headers:this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  createAction(workOrder:WorkOrder):Promise<ResponseData>{
    return this.http
      .post(this.saveactionurl, workOrder, {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  editAction(actionDetail:any):Promise<ResponseData>{
    return this.http
      .post(this.editactionurl, actionDetail, {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  deleteAction(id:string):Promise<ResponseData> {
    return this.http
      .get(this.deleteactionurl+'/'+id,{headers:this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  private printOperationUrl='/page/operation';
  printOperation(id:string):Promise<ResponseData>{
    return this.http
      .get(this.deleteactionurl+'/'+id)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }


  private extractData(res:Response){
    let body=res.json();
    return body||{} ;
  }
  private handleError(error:Response|any){
    let errMsg:string;
    if(error instanceof Response){
      const body=error.json()||'';
      const err=body.err||JSON.stringify(body);
      errMsg=`${error.status} - ${error.statusText||''} ${err}`
    }
    else{
      errMsg=error.message?error.message:error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }
}
