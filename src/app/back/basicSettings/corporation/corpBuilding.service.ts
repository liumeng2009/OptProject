import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'

import {CorpBuilding} from '../../../bean/corpBuilding';


@Injectable()
export class CorpBuildingService{

  private listurl=new OptConfig().serverPath+'/api/corpBuildings/list';
  private saveurl=new OptConfig().serverPath+'/api/corpBuildings/save';
  private deleteurl=new OptConfig().serverPath+'/api/corpBuildings/delete';
  private geturl=new OptConfig().serverPath+'/api/corpBuildings/';

  constructor(private http:Http,private cookieService:CookieService){}

  getCorporationList(corpid):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    let url='';
    url=this.listurl+'/'+corpid
    console.log(url);
    return this.http.get(url,{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  create(corpBuilding:CorpBuilding): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.saveurl, corpBuilding, {headers: headers})
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

  getCorporation(id:string):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http.get(this.geturl,{headers:headers})
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
