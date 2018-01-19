import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {User} from '../../bean/user';

import {OptConfig} from '../../config/config'
import {ResponseData} from "../../bean/responseData";
import {CookieService} from "angular2-cookie/core";

@Injectable()
export class TotalService{
  private headers = new Headers({'Content-Type': 'application/json'});

  private listurl=new OptConfig().serverPath+'/api/operation/list';
  private workerdoinglisturl=new OptConfig().serverPath+'/api/workers/doinglist';
  private actionlisturl=new OptConfig().serverPath+'/api/action/list';
  private oplistweekurl=new OptConfig().serverPath+'/api/operation/list_week';
  private oplistmonthurl=new OptConfig().serverPath+'/api/operation/list_month';
  private oplistmonthworkerurl=new OptConfig().serverPath+'/api/operation/list_month_worker';
  private oplistmonthworkertimeurl=new OptConfig().serverPath+'/api/operation/list_month_worker_time';

  constructor(private http:Http,private cookieService:CookieService){}

  getOperationList(time):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url='';
    let searchStr='/time/'+time
    url=this.listurl+searchStr+'?token='+token

    console.log(url);
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  getDoingList(time):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url=this.workerdoinglisturl+'/time/'+time+'?token='+token;
    console.log(url);
    return this.http
      .get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getActionList(time):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url=this.actionlisturl+'/time/'+time+'?token='+token;
    console.log(url);
    return this.http
      .get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getOperationListWeek(time):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url=this.oplistweekurl+'/time/'+time+'?token='+token;
    console.log(url);
    return this.http
      .get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  getOperationListMonth(time):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url=this.oplistmonthurl+'/time/'+time+'?token='+token;
    console.log(url);
    return this.http
      .get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getOperationListMonthWorker(time):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url=this.oplistmonthworkerurl+'/time/'+time+'?token='+token;
    console.log(url);
    return this.http
      .get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getOperationListMonthWorkerTime(time):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let url=this.oplistmonthworkertimeurl+'/time/'+time+'?token='+token;
    console.log(url);
    return this.http
      .get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
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

