import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../bean/responseData';

import {OptConfig} from '../../config/config'

@Injectable()
export class AuthService{
  private checkauthurl=new OptConfig().serverPath+'/api/authinrole/check';
  //private checktokenurl=new OptConfig().serverPath+'/api/user/checktoken';

  constructor(private http:Http,private cookieService:CookieService){}

  checkAuth(routeConfig:any):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http.post(this.checkauthurl,routeConfig,{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

/*  checkToken():Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http.get(this.checktokenurl,{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }*/


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

