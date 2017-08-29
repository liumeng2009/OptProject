import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'

import {Group} from '../../../bean/group';


@Injectable()
export class GroupService{
  private headers = new Headers({'Content-Type': 'application/json'});

  private listurl=new OptConfig().serverPath+'/api/groups/list';
  private saveurl=new OptConfig().serverPath+'/api/groups/save';
  private deleteurl=new OptConfig().serverPath+'/api/groups/delete';
  private geturl=new OptConfig().serverPath+'/api/groups/';

  constructor(private http:Http,private cookieService:CookieService){}

  getGroupList(pageid):Promise<ResponseData>{
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

  create(group:Group): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    return this.http
      .post(this.saveurl+'?token='+token, group, {headers: this.headers})
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

  getGroup(id:string):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url=this.geturl+id+'?token='+token;
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
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
