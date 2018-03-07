import {Injectable} from '@angular/core'
import {CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild} from '@angular/router'
import {AuthService} from '../auth/auth.service';
import {AjaxExceptionService} from "./ajaxExceptionService";
import {ApiResultService} from "./apiResult.service";

@Injectable()
export class AuthGuard implements CanActivate{

  constructor(
    private authService:AuthService,
    private ajaxExceptionService:AjaxExceptionService,
    private apiResultService:ApiResultService
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
          console.log('功能：'+func+'操作'+op+'可以进入');
          return true;
        }
        return false;
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
        return false;
      }
    )
  }
}
