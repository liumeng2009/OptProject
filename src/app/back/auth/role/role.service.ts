import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'

import {User} from '../../../bean/user';


@Injectable()
export class RoleService{
  private headers = new Headers({'Content-Type': 'application/json'});

  private listurl=new OptConfig().serverPath+'/api/role/list';
  private addurl=new OptConfig().serverPath+'/api/role/add';
  private editurl=new OptConfig().serverPath+'/api/role/edit';
  private deleteurl=new OptConfig().serverPath+'/api/role/delete';
  private geturl=new OptConfig().serverPath+'/api/role';
/*  private saveurl=new OptConfig().serverPath+'/api/user/reg';
  private editurl=new OptConfig().serverPath+'/api/user/edit';
  private deleteurl=new OptConfig().serverPath+'/api/user/delete';
  private geturl=new OptConfig().serverPath+'/api/user/';*/

  constructor(private http:Http,private cookieService:CookieService){}

  getRoleList():Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url=this.listurl+'?token='+token
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  getRole(id):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url=this.geturl+'/'+id+'?token='+token;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  create(role:any): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    return this.http
      .post(this.addurl+'?token='+token, role, {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  edit(role:any): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    return this.http
      .post(this.editurl+'?token='+token, role, {headers: this.headers})
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
