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
  private saveurl=new OptConfig().serverPath+'/api/operation/add';
  private deleteurl=new OptConfig().serverPath+'/api/operation/delete';

  private saveactionurl=new OptConfig().serverPath+'/api/action/add';
  private editactionurl=new OptConfig().serverPath+'/api/action/edit';
  private deleteactionurl=new OptConfig().serverPath+'/api/action/delete';

  constructor(private http:Http,private cookieService:CookieService){}

  getOperationList(pageid):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url='';
    if(pageid){
      url=this.listurl+'/page/'+pageid+'?token='+token
    }
    else{
      url=this.listurl+'?token='+token
    }
    console.log(url);
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  getOperation(id):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');

    let url=this.geturl+'/'+id+'?token='+token

    console.log(url);
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  create(userId:string): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    return this.http
      .post(this.saveurl+'?token='+token, {userId:userId}, {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  delete(id:string):Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    return this.http
      .get(this.deleteurl+'/'+id+'?token='+token)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  createAction(workOrder:WorkOrder):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    return this.http
      .post(this.saveactionurl+'?token='+token, workOrder, {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  editAction(actionDetail:any):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    return this.http
      .post(this.editactionurl+'?token='+token, actionDetail, {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  deleteAction(id:string):Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    return this.http
      .get(this.deleteactionurl+'/'+id+'?token='+token)
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
