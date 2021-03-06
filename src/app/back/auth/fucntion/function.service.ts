import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'



@Injectable()
export class FunctionService{

  private listurl=new OptConfig().serverPath+'/api/function/list';
  private parentlisturl=new OptConfig().serverPath+'/api/function/parent_list';
  private addurl=new OptConfig().serverPath+'/api/function/add';

  private oplisturl=new OptConfig().serverPath+'/api/operate/list';

  private authCreateUrl=new OptConfig().serverPath+'/api/opinfunc/add';
  private authDeleteUrl=new OptConfig().serverPath+'/api/opinfunc/delete';

  constructor(private http:Http,private cookieService:CookieService){}

  getList():Promise<ResponseData>{
    return this.http.get(this.listurl)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  getOpList():Promise<ResponseData>{
    return this.http.get(this.oplisturl)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  createAuth(auth:any): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.authCreateUrl, auth, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  deleteAuth(auth:any): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.authDeleteUrl+'?token='+token, auth, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getParentList():Promise<ResponseData>{
    return this.http.get(this.parentlisturl)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  create(functionObj:any): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.addurl, functionObj, {headers: headers})
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
