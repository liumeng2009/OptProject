import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {User} from '../../bean/user';

import {OptConfig} from '../../config/config'
import {ResponseData} from "../../bean/responseData";

@Injectable()
export class TotalService{
  private loginurl=new OptConfig().serverPath+'/api/user/reg'

  constructor(private http:Http){}

  reg(username:string,password:string):Promise<ResponseData>{

    let headers=new Headers({'Content-Type':'application/json'});
    let options=new RequestOptions(headers);
    console.log('请求的url是：'+this.loginurl);
    return this.http.post(this.loginurl,{username:username,password:password},options)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }

  private extractData(res:Response){
    let body=res.json();
    console.log(JSON.stringify(body));
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

