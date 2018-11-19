import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {User} from '../../bean/user';

import {OptConfig} from '../../config/config'
import {ResponseData} from "../../bean/responseData";
import {CookieService} from "angular2-cookie/core";
import {HttpParams} from "@angular/common/http";

@Injectable()
export class TotalService{
  private headers ;

  private listurl=new OptConfig().serverPath+'/api/operation/list';
  private workerdoinglisturl=new OptConfig().serverPath+'/api/workers/doinglist';
  private actionlisturl=new OptConfig().serverPath+'/api/action/list';
  private oplistweekurl=new OptConfig().serverPath+'/api/operation/list_week';
  private oplistmonthurl=new OptConfig().serverPath+'/api/operation/list_month';
  private oplistmonthworkerurl=new OptConfig().serverPath+'/api/operation/list_month_worker';
  private oplistmonthworkertimeurl=new OptConfig().serverPath+'/api/operation/list_month_worker_time';
  private oplistmonthcorporationcounturl=new OptConfig().serverPath+'/api/operation/list_month_corporation_count';
  private opcounturl = new OptConfig().serverPath+ '/api/operation/allOpCount';
  private opcountsimpleurl = new OptConfig().serverPath+ '/api/operation/allOpCountSimple';
  private opstampurl = new OptConfig().serverPath+ '/api/operation/allOpStamp';
  private opstampsimpleurl = new OptConfig().serverPath+ '/api/operation/allOpStampSimple';
  private businesstypeurl = new OptConfig().serverPath+ '/api/operation/allBusinessType';


  constructor(private http:Http,private cookieService:CookieService){

  }

  getOperationList(time):Promise<ResponseData>{
    let url='';
    let searchStr='/time/'+time
    url=this.listurl+searchStr
    return this.http.get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  getDoingList(time):Promise<ResponseData>{
    let url=this.workerdoinglisturl+'/time/'+time;
    return this.http
      .get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getActionList(time):Promise<ResponseData>{
    let url=this.actionlisturl+'/time/'+time;
    return this.http
      .get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getOperationListWeek(time):Promise<ResponseData>{
    let url=this.oplistweekurl+'/time/'+time;
    return this.http
      .get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  getOperationListMonth(time):Promise<ResponseData>{
    let url=this.oplistmonthurl+'/time/'+time;
    return this.http
      .get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getOperationListMonthWorker(time):Promise<ResponseData>{
    let url=this.oplistmonthworkerurl+'/time/'+time;
    return this.http
      .get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getOperationListMonthWorkerTime(time):Promise<ResponseData>{
    let url=this.oplistmonthworkertimeurl+'/time/'+time;
    return this.http
      .get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  getOperationListMonthCoprationCount(time):Promise<ResponseData>{
    let url=this.oplistmonthcorporationcounturl+'/time/'+time;
    return this.http
      .get(url)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  getOpCount(startStamp:number, endStamp:number):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    let url=this.opcounturl+'?start='+startStamp+'&end='+endStamp;
    return this.http
      .get(url, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  getOpCountSimple(startStamp:number, endStamp:number):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    let url=this.opcountsimpleurl+'?start='+startStamp+'&end='+endStamp;
    return this.http
      .get(url, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  getOpStamp(startStamp:number, endStamp:number):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    let url=this.opstampurl+'?start='+startStamp+'&end='+endStamp;;
    return this.http
      .get(url, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  getOpStampSimple(startStamp:number, endStamp:number):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    let url=this.opstampsimpleurl+'?start='+startStamp+'&end='+endStamp;;
    return this.http
      .get(url, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }
  getYearBusinessType(startStamp:number, endStamp:number):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    let url=this.businesstypeurl+'?start='+startStamp+'&end='+endStamp;;
    return this.http
      .get(url, {headers: headers})
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

