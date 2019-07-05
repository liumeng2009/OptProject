import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {DialogService, DialogRef, DialogCloseResult, DialogResult} from '@progress/kendo-angular-dialog';
import { FileRestrictions } from '@progress/kendo-angular-upload';

import {UserService} from '../user/user.service';
import {AlertData} from '../../../bean/alertData';

import {OptConfig} from '../../../config/config';

import {User} from '../../../bean/user';

import {ApiResultService} from '../../main/apiResult.service';
import {AjaxExceptionService} from '../../main/ajaxExceptionService';
import {MissionService} from '../../main/mission.service';
import {SwitchService} from '../../main/switchService';
import {CookieService} from 'angular2-cookie/core';
import {Avatar} from '../../../bean/avatar';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})

export class SettingComponent implements OnInit {
  user: User= new User(null, null, null, null, null, null, null, null, null, null);
  baseImageUrl: string = new OptConfig().serverPath;
  avatarImagePath= this.baseImageUrl + '/uploads/avatar/动漫/6.jpg';
  constructor(
    private userService: UserService,
    private apiResultService: ApiResultService,
    private ajaxExceptionService: AjaxExceptionService,
    private dialogService: DialogService,
    private cookieService: CookieService,
    private missionService: MissionService
  ) {
  };


  ngOnInit() {
    this.getData();
    const token = this.cookieService.get('optToken');
    this.uploadSaveUrl = this.uploadSaveUrl + '?token=' + token;
  }

   getData() {
    this.userService.getUserSimple().then(
      data => {
        const result = this.apiResultService.result(data);
        if (result && result.status === 0) {
          this.user = result.data;
        }
      },
      error => {
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }


   getAvatarImageUrl(user) {
    if (user.avatar) {
      if (user.avatarUseImg === 1) {
        // 说明是上传的图片
        return this.baseImageUrl + '/uploads/' + user.avatar;
      }else {
        return this.baseImageUrl + user.avatar
      }
    }else {
      return this.avatarImagePath;
    }
  }


   onSubmit() {
    this.userService.edit(this.user).then(
      data => {
        const result = this.apiResultService.result(data);
        if (result && result.status === 0) {
          this.getData();
        }
      },
      error => {
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  @ViewChild('itemListRef')tpl: TemplateRef<any>;
  @ViewChild('actionTemplate')actionTemplate: TemplateRef<any>;
   dialog;
   sysAvatars= [];
   serverpath= new OptConfig().serverPath;
   changeAvatar(){
    this.dialog = this.dialogService.open({
      title: '替换头像',
      content: this.tpl,
      actions: this.actionTemplate,
    });

    this.userService.sysAvatar().then(
      data => {
        let result = this.apiResultService.result(data);
        if (result && result.status == 0){
          //把路径补充完整
          this.sysAvatars = result.data;
        }
      },
      error => {
        this.ajaxExceptionService.simpleOp(error);
      }
    )


  }
   cancel(){
    this.dialog.close();
  }
   header= new Headers({'Content-Type': 'multipart/form-data'});
   uploadSaveUrl= new OptConfig().serverPath + '/api/user/uploadAvatar';

   myRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.png', '.jpeg']
  };

   successResult($event){
    console.log($event);
    let res = $event.response;
    let json = res.json();
    if (json && json.data && json.data.avatar){
      let avatarNow = json.data.avatar;
      const avatarType = json.data.avatarUseImg ? json.data.avatarUseImg : 0;
      this.user.avatar = avatarNow;
      this.user.avatarUseImg = 1;
      this.missionService.changeAvatar.emit(new Avatar(avatarNow, avatarType));
      this.dialog.close();
    }
  }
   errorResult($event){
    console.log($event);
  }

   changeSysAvatar(img){
    this.userService.setSysAvatar({img: img}).then(
      data => {
        const result = this.apiResultService.result(data);
        if (result && result.status == 0){
          //this.getData();
          this.user.avatar = img;
          this.user.avatarUseImg = 0;
          this.missionService.changeAvatar.emit(new Avatar(img, 0));
          this.dialog.close();
        }
      },
      error => {
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }


}
