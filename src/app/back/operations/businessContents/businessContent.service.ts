import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'

import {BusinessContent} from '../../../bean/businessContent';


@Injectable()
export class BusinessContentService{
  private headers = new Headers({'Content-Type': 'application/json'});

  private listurl=new OptConfig().serverPath+'/api/business/list';
  private saveurl=new OptConfig().serverPath+'/api/business/save';
  private geturl=new OptConfig().serverPath+'/api/business/';
  private getequipment=new OptConfig().serverPath+'/api/business/getequip/get';
  private deleteurl=new OptConfig().serverPath+'/api/business/delete'

  constructor(private http:Http,private cookieService:CookieService){}

  getBusinessContentList(pageid,type:string,equipment:string):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url='';
    if(pageid){
        url=this.listurl+'/page/'+pageid+'?token='+token
        }
    else{
        url=this.listurl+'?token='+token
        }
    if(type&&type!=''){
      url=url+'&type='+type
    }
    if(equipment&&equipment!=''){
      url=url+'&equipment='+equipment
    }


    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  create(businessContent:BusinessContent): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    return this.http
      .post(this.saveurl+'?token='+token, businessContent, {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getBusiness(id:string):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    return this.http
      .get(this.geturl+id+'?token='+token)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }


  getEquipment(type:string):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    if(type&&type!=''){
      return this.http
        .get(this.getequipment+'/'+type+'?token='+token)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
    else{
      return this.http
        .get(this.getequipment+'?token='+token)
        .toPromise()
        .then(this.extractData)
        .catch(this.handleError);
    }
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
