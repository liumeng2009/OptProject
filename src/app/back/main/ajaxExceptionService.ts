import {Injectable} from '@angular/core';

  import {OptConfig} from "../../config/config";
import {AlertData} from "../../bean/alertData";

  import {MissionService} from './mission.service';
import {environment} from '../../../environments/environment';

  @Injectable()
export class AjaxExceptionService {


  constructor(
    private missionService:MissionService
  ){

  }

    simpleOp(error:string){
      if(environment.production){
          this.missionService.change.emit(new AlertData('danger',new OptConfig().ajaxError));
        }
      else{
          this.missionService.change.emit(new AlertData('danger',error+'.please press F5 to refresh.'));
        }
    }

  }
