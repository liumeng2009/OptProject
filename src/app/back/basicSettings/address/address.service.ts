import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'

import {Building} from '../../../bean/building';


@Injectable()
export class AddressService{
  private listurl=new OptConfig().serverPath+'/api/buildings/list';
  private saveurl=new OptConfig().serverPath+'/api/buildings/save';
  private deleteurl=new OptConfig().serverPath+'/api/buildings/delete';
  private geturl=new OptConfig().serverPath+'/api/buildings/';

  constructor(private http:Http,private cookieService:CookieService){

  }

  getAddressList(pageid):Promise<ResponseData>{
    let url='';
    if(pageid){
        url=this.listurl+'/page/'+pageid
        }
    else{
        url=this.listurl
        }
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  create(building:Building): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.saveurl, building, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  delete(id:string):Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
        .get(this.deleteurl+'/'+id,{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getAddress(id:string):Promise<ResponseData>{
    let url=this.geturl+id;
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
