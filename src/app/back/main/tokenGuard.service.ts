import {Injectable} from '@angular/core'
import {CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  ActivatedRoute
} from '@angular/router'
import {Location} from '@angular/common';
import {AuthService} from '../auth/auth.service';
import {AjaxExceptionService} from "./ajaxExceptionService";
import {ApiResultService} from "./apiResult.service";
import {AlertData} from "../../bean/alertData";
import {MissionService} from "./mission.service";

@Injectable()
export class TokenGuard implements CanActivate{

  constructor(
    private authService:AuthService,
    private ajaxExceptionService:AjaxExceptionService,
    private apiResultService:ApiResultService,
    private router:Router,
    private route:ActivatedRoute,
    private missionService:MissionService,
    private location:Location
  ){

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.authService.checkToken().then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status){
          if(result.status==0){
            return true;
          }
          else(result.status==10001||result.status==10003){
            //token都不符合
            this.gotoLoginPage(data);

          }
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private rememberUrl(){
    let url=this.location.path();
    return url;
  }

  private gotoLoginPage(data){
    this.missionService.change.emit(new AlertData('danger',data.message+'需要重新登陆！'));
    setTimeout(()=>{
      let urlTree=this.router.parseUrl(this.router.url);
      let queryParams=urlTree.queryParams;
      let rememberUrl=this.rememberUrl();
      if(queryParams.redirectTo){

      }
      else{
        queryParams.redirectTo=rememberUrl;
      }
      this.router.navigate(['/login'],{queryParams:queryParams});
    },2000);
  }

}
