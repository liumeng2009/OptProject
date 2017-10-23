import {Injectable} from '@angular/core';

import {Router} from '@angular/router';
import {Location} from '@angular/common';

import {ResponseData} from '../../bean/responseData';
import {OptConfig} from "../../config/config";
import {AlertData} from "../../bean/alertData";

import {MissionService} from './mission.service';

@Injectable()
export class ApiResultService {


  constructor(
    private missionService:MissionService,
    private router:Router,
    private location:Location
  ){

  }

  result(data:ResponseData){
    if(data.status==0){
      if(data.message&&data.message!=''){
        this.missionService.change.emit(new AlertData('success',data.message));
      }
      return data;
    }
    else if(data.status==10001){
      this.missionService.change.emit(new AlertData('danger',data.message+'需要重新登陆！'));
      //setTimeout(()=>{
      let urlTree=this.router.parseUrl(this.router.url);
      let queryParams=urlTree.queryParams;
      let rememberUrl=this.rememberUrl();
      queryParams.redirectTo=rememberUrl;
      this.router.navigate(['/login'],{queryParams:queryParams});
      //},2000);
    }
    else if(data.status==10003){
      this.missionService.change.emit(new AlertData('danger',data.message+'需要重新登陆！'));
      //setTimeout(()=>{
      let urlTree=this.router.parseUrl(this.router.url);
      let queryParams=urlTree.queryParams;
      let rememberUrl=this.rememberUrl();
      queryParams.redirectTo=rememberUrl;
      this.router.navigate(['/login'],{queryParams:queryParams});
      //},2000);
    }
    else if(data.status==500){
      this.missionService.change.emit(new AlertData('danger',new OptConfig().unknownError));
    }
    else{
      this.missionService.change.emit(new AlertData('danger',data.message));
    }
  }

  private rememberUrl(){
    let url=this.location.path();

    return url;

    //this.router.navigate(['list'],{queryParams:queryParams,relativeTo:this.route.parent});

  }

}
