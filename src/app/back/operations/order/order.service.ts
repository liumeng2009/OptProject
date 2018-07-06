import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'

import {Order} from '../../../bean/order';


@Injectable()
export class OrderService{
  private listurl=new OptConfig().serverPath+'/api/order/list';
  private saveurl=new OptConfig().serverPath+'/api/order/save';
  private saveorderurl=new OptConfig().serverPath+'/api/order/saveOrder';
  private geturl=new OptConfig().serverPath+'/api/order/';
  //private getorderno=new OptConfig().serverPath+'/api/order/getorderno/get/';
  private deleteurl=new OptConfig().serverPath+'/api/order/delete'

  constructor(private http:Http,private cookieService:CookieService){

  }

  getOrderList(pageid,time):Promise<ResponseData>{
    let url='';
    if(pageid){
      if(time){
        url=this.listurl+'/page/'+pageid+'/time/'+time
      }else{
        url=this.listurl+'/page/'+pageid
      }

    }
    else{
      if(time){
        url=this.listurl+'/time/'+time
      }
      else{
        url=this.listurl
      }
    }

    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  create(order:Order): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.saveurl, order, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  //建立订单和工单
  createOperation(order:Order): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.saveorderurl, order, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getOrder(id:string):Promise<ResponseData>{
    return this.http
      .get(this.geturl+id)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  delete(id:string):Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .get(this.deleteurl+'/'+id, {headers: headers})
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
