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
export class AuthGuard implements CanActivate{

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
    console.log(route);
    console.log(state);

    let func='';
    let op='';

    //处理，得到路径对应的func和op
    let path=route.routeConfig.path;

    switch(path){
      case 'add':
        func=route.parent.routeConfig.path;
        op='add';
        break;
      case 'add/:orderid':
        func=route.parent.routeConfig.path;
        op='add';
        break;
      case 'list':
        func=route.parent.routeConfig.path;
        op='list';
        break;
      case ':id':
        //编辑
        func=route.parent.routeConfig.path;
        op='edit';
        break;
      default:
        func=route.routeConfig.path;
        op='menu';
        break;
    }
    return this.authService.checkAuth({func:func,op:op}).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          console.log(func+op+'可以进入');
          return true;
        }
        else{
          //token没有权限
          this.missionService.change.emit(new AlertData('danger',data.message+'没有访问权限！'));
          this.router.navigate(['./needtoken'],{relativeTo:this.route});
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
        this.router.navigate(['./needtoken'],{relativeTo:this.route});
      }
    )
  }

  private rememberUrl(){
    let url=this.location.path();
    return url;
  }

}
