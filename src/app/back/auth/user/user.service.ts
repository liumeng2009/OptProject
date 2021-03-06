import {Injectable} from '@angular/core';
import {Http,Response,Headers,RequestOptions} from '@angular/http';


import 'rxjs/add/operator/toPromise';

import {CookieService} from 'angular2-cookie/core';

import {ResponseData} from '../../../bean/responseData';

import {OptConfig} from '../../../config/config'

import {User} from '../../../bean/user';


@Injectable()
export class UserService{

  private listurl=new OptConfig().serverPath+'/api/user/list';
  private saveurl=new OptConfig().serverPath+'/api/user/reg';
  private editurl=new OptConfig().serverPath+'/api/user/edit';
  private deleteurl=new OptConfig().serverPath+'/api/user/delete';
  private geturl=new OptConfig().serverPath+'/api/user/';

  private sysavatarurl=new OptConfig().serverPath+'/api/user/sysAvatar/list'
  private setsysavatarurl=new OptConfig().serverPath+'/api/user/sysAvatar/set'

  constructor(private http:Http,private cookieService:CookieService){}

  getUserList(pageid):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
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

  create(user:User): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.saveurl+'?token='+token, user, {headers: headers})
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

  getUser(id:string):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    let url=this.geturl+id
    return this.http.get(url,{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  getUserSimple():Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    let url=this.geturl+'?simple=true'
    return this.http.get(url,{headers:headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  edit(user:User): Promise<ResponseData> {
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.editurl, user, {headers: headers})
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError);
  }

  sysAvatar():Promise<ResponseData>{
    return this.http.get(this.sysavatarurl)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleError)
  }
  setSysAvatar(img):Promise<ResponseData>{
    let token=this.cookieService.get('optToken');
    let headers= new Headers({'Content-Type': 'application/json','authorization':token});
    return this.http
      .post(this.setsysavatarurl, img, {headers: headers})
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
