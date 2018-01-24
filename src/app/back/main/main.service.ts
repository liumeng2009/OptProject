import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../bean/responseData';

import {OptConfig} from '../../config/config'

@Injectable()
export class MainService{
  private loginurl=new OptConfig().serverPath+'/api/user/';
  private urltree=new OptConfig().serverPath+'/api/user/get/urltree';

  constructor(private http:Http,private cookieService:CookieService){}

  getUserInfo():Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    return this.http.get(this.loginurl+'?token='+token)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  getUrlTree():Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url=this.urltree+'?token='+token;
    console.log(url);
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  private extractData(res:Response){
    let body=res.json();
    return body||{};
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

