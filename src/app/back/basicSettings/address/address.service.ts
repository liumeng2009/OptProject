import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'

import {Building} from '../../../bean/building';


@Injectable()
export class AddressService{
  private headers = new Headers({'Content-Type': 'application/json'});

  private listurl=new OptConfig().serverPath+'/api/buildings/list';
  private saveurl=new OptConfig().serverPath+'/api/buildings/save';

  constructor(private http:Http,private cookieService:CookieService){}

  getAddressList():Observable<ResponseData>{
    let token=this.cookieService.get('optToken');
    return this.http.get(this.listurl+'?token='+token)
      .map(this.extractData)
      .catch(this.handleError)
  }

  create(building:Building): Observable<ResponseData> {
    let token=this.cookieService.get('optToken');
    return this.http
      .post(this.saveurl+'?token='+token, building, {headers: this.headers})
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res:Response){
    console.log(888888888888888888);
    let body=res.json();
    return body||{};
  }
  private handleError(error:Response|any){
    console.log('9999999999999999');
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
    return Observable.throw(errMsg);
  }
}
