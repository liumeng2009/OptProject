import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';

import {Observable} from 'rxjs/observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {User} from '../../bean/user';

import {OptConfig} from '../../config/config'

@Injectable()
export class LoginService{
  private loginurl=new OptConfig().serverPath+'/api/user/login'

  constructor(private http:Http){}

  login(username:string,password:string):Observable<User>{

    let headers=new Headers({'Content-Type':'application/json'});
    let options=new RequestOptions({headers:headers});
    console.log('请求的url是：'+this.loginurl);
    return this.http.post(this.loginurl,{username:username,password:password},options)
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(res:Response){
    let body=res.json();
    return body.data||{};
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
    return Observable.throw(errMsg);
  }
}

