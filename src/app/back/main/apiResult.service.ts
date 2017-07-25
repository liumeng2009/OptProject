import {Injectable} from '@angular/core';

import {Router} from '@angular/router';

import {ResponseData} from '../../bean/responseData';
import {OptConfig} from "../../config/config";
import {AlertData} from "../../bean/alertData";

import {MissionService} from './mission.service';

@Injectable()
export class ApiResultService {


  constructor(
    private missionService:MissionService,
    private router:Router
  ){

  }

  result(data:ResponseData){
    if(data.status==0){
      return data;
    }
    else if(data.status==10001){
      this.missionService.change.emit(new AlertData('danger',data.message+'需要重新登陆！'));
      setTimeout(()=>{
        this.router.navigateByUrl('/login');
      },2000);
    }
    else if(data.status==10003){
      this.missionService.change.emit(new AlertData('danger',data.message+'需要重新登陆！'));
      setTimeout(()=>{
        this.router.navigateByUrl('/login');
      },2000);
    }
    else if(data.status==500){
      this.missionService.change.emit(new AlertData('danger',new OptConfig().unknownError));
    }
    else{
      this.missionService.change.emit(new AlertData('danger',data.message));
    }
  }

}
