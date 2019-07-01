import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

import {CookieService} from 'angular2-cookie/core';

import {User} from '../../bean/user'

import { ToastsManager, ToastOptions } from 'ng2-toastr/ng2-toastr';

import {LoginService} from './login.service'
import {OptConfig} from '../../config/config';
import {environment} from '../../../environments/environment';
import {MissionService} from '../main/mission.service';
import {SwitchService} from '../main/switchService';

@Component({
  selector: 'login-area',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit{

  private iconClass= 'k-icon k-i-lock fz-18';
  private isDisabled= false;

  constructor(
    private loginService: LoginService,
    private cookieService: CookieService,
    private router: Router,
    private title: Title,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private missionService: MissionService,
    private switchService: SwitchService
  ){
    this.toastr.setRootViewContainerRef(vcr);
  };
  user= new User(null, null, null, null, null, null, null, null, null, null);

  ngOnInit(){
    // 告诉main组件，不要显示toast了
    this.missionService.remove.emit('remove');
    this.switchService.setIsIntoMain(false);
    this.title.setTitle('登录');
  }


  onSubmit(): void{
    this.isDisabled = true;
    this.iconClass = 'k-icon k-i-loading fz-18';
    const urlTree = this.router.parseUrl(this.router.url);
    const queryParams = urlTree.queryParams;
    const rememberUrl = queryParams.redirectTo;
    this.loginService.login(this.user.name, this.user.password)
      .then(
        data => {
          if (data.status === 0){
            this.toastr.success('欢迎您,' + data.data.name, '登录成功');
            setTimeout(() => {
              this.isDisabled = false;
              this.iconClass = 'k-icon k-i-lock fz-18';
              const date = new Date();
              date.setDate(date.getDate() + 7);
              this.cookieService.put('optToken', data.data.token, {expires: date});
              if (rememberUrl && rememberUrl !== ''){
                this.router.navigate([rememberUrl]);
              }
              else{
                this.router.navigate(['/admin']);
              }
            }, 2000);
          }
          else{
            this.isDisabled = false;
            this.iconClass = 'k-icon k-i-lock fz-18';
            this.toastr.error(data.message, '登录失败');
            // this.errorMessage=data.message
          }
        },
        error => {
          this.isDisabled = false;
          this.iconClass = 'k-icon k-i-lock fz-18';
          if (environment.production){
            this.toastr.error(new OptConfig().ajaxError, '登录失败');
          }
          else {
            this.toastr.error(error, '登录失败');
            // this.errorMessage = error;
          }
        }

      );
  }
}
