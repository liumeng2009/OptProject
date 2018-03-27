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
/*    return this.authService.checkToken().then(
      data=>{
        console.log(route);
        console.log(state);
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
            return true;
        }
        else{
          console.log('5秒后跳转到login页面');
          setTimeout(()=>{
            this.gotoLoginPage(data);
          },5000);
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
        //this.gotoLoginPage('');
      }
    )*/

    return true;

  }

  private rememberUrl(){
    let url=this.location.path();
    return url;
  }

  private gotoLoginPage(data){
    //this.missionService.change.emit(new AlertData('danger',data.message+'需要重新登陆！'));
    let urlTree=this.router.parseUrl(this.router.url);
    let queryParams=urlTree.queryParams;
    let rememberUrl=this.rememberUrl();
    if(queryParams.redirectTo){

    }
    else{
      queryParams.redirectTo=rememberUrl;
    }
    if(queryParams.redirectTo!=''&&queryParams.redirectTo.indexOf('login')<0){
      this.router.navigate(['/login'],{queryParams:queryParams});
    }
    else{
      this.router.navigate(['/login']);
    }
  }
}
