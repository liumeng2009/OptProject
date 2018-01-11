import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'

import {Order} from '../../../bean/order';


@Injectable()
export class OrderService{
  private headers = new Headers({'Content-Type': 'application/json'});

  private listurl=new OptConfig().serverPath+'/api/order/list';
  private saveurl=new OptConfig().serverPath+'/api/order/save';
  private saveorderurl=new OptConfig().serverPath+'/api/order/saveOrder';
  private geturl=new OptConfig().serverPath+'/api/order/';
  private getorderno=new OptConfig().serverPath+'/api/order/getorderno/get/';
  private deleteurl=new OptConfig().serverPath+'/api/order/delete'

  constructor(private http:Http,private cookieService:CookieService){}

  getOrderList(pageid,time):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url='';
    if(pageid){
      if(time){
        url=this.listurl+'/page/'+pageid+'/time/'+time+'?token='+token
      }else{
        url=this.listurl+'/page/'+pageid+'?token='+token
      }

    }
    else{
      if(time){
        url=this.listurl+'/time/'+time+'?token='+token
      }
      else{
        url=this.listurl+'?token='+token
      }
    }

    /*
    if(type&&type!=''){
      url=url+'&type='+type
    }
    if(equipment&&equipment!=''){
      url=url+'&equipment='+equipment
    }
*/
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  create(order:Order): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    return this.http
      .post(this.saveurl+'?token='+token, order, {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  //建立订单和工单
  createOperation(order:Order): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    return this.http
      .post(this.saveorderurl+'?token='+token, order, {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getOrder(id:string):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    console.log(this.geturl+id+'?token='+token);
    return this.http
      .get(this.geturl+id+'?token='+token)
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
