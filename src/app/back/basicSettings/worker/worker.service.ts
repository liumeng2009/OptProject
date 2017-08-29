import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'

import {User} from '../../../bean/user';


@Injectable()
export class WorkerService{
  private headers = new Headers({'Content-Type': 'application/json'});

  private listurl=new OptConfig().serverPath+'/api/workers/list';
  private saveurl=new OptConfig().serverPath+'/api/workers/add';
  private deleteurl=new OptConfig().serverPath+'/api/workers/delete';

  constructor(private http:Http,private cookieService:CookieService){}

  getWorkerList(pageid):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url='';
    if(pageid){
      url=this.listurl+'/page/'+pageid+'?token='+token
    }
    else{
      url=this.listurl+'?token='+token
    }
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

  delete(userId:string):Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    return this.http
      .get(this.deleteurl+'/'+userId+'?token='+token)
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
