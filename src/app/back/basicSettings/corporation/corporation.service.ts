import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'

import {Corporation} from '../../../bean/corporation';


@Injectable()
export class CorporationService{
  private headers ;

  private listurl=new OptConfig().serverPath+'/api/corporations/list';
  private saveurl=new OptConfig().serverPath+'/api/corporations/save';
  private deleteurl=new OptConfig().serverPath+'/api/corporations/delete';
  private geturl=new OptConfig().serverPath+'/api/corporations/';

  constructor(private http:Http,private cookieService:CookieService){
    let token=this.cookieService.get('optToken');
    this.headers== new Headers({'Content-Type': 'application/json','authorization':token});
  }

  getCorporationList(pageid,groupId:string):Promise<ResponseData>{
    let url='';
    if(pageid){
      url=this.listurl+'/page/'+pageid
    }
    else{
      url=this.listurl
    }
    if(groupId!=null&&groupId!=undefined){
      url+='&group='+groupId
    }
    console.log(url);
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  create(group:Corporation): Promise<ResponseData> {
    return this.http
      .post(this.saveurl, group, {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  delete(id:string):Promise<ResponseData> {
    return this.http
        .get(this.deleteurl+'/'+id, {headers: this.headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getCorporation(id:string):Promise<ResponseData>{
    let url=this.geturl+id
    console.log(url);
    return this.http.get(url, {headers: this.headers})
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
