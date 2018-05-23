import {Component,OnInit,ViewChild,TemplateRef} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import {DialogService,DialogRef,DialogCloseResult,DialogResult} from '@progress/kendo-angular-dialog';
import { FileRestrictions } from '@progress/kendo-angular-upload';

import {UserService} from '../user/user.service';
import {AlertData} from "../../../bean/alertData";

import {OptConfig} from '../../../config/config';

import {User} from '../../../bean/user';

import {ApiResultService} from '../../main/apiResult.service';
import {AjaxExceptionService} from '../../main/ajaxExceptionService';
import {MissionService} from "../../main/mission.service";
import {SwitchService} from "../../main/switchService";
import {CookieService} from "angular2-cookie/core";
import {Avatar} from "../../../bean/avatar";

@Component({
  selector:'setting',
  templateUrl:'./setting.component.html',
  styleUrls:['./setting.component.scss']
})

export class SettingComponent implements OnInit{

  constructor(
    private userService:UserService,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private dialogService:DialogService,
    private cookieService:CookieService,
    private missionService:MissionService
  ){
  };

  private user:User=new User(null,null,null,null,null,null,null,null,null,null);
  ngOnInit(){
    this.getData();
    let token=this.cookieService.get('optToken');
    this.uploadSaveUrl=this.uploadSaveUrl+'?token='+token;
  }

  private getData(){
    this.userService.getUserSimple().then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.user=result.data;
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  private baseImageUrl: string = new OptConfig().serverPath;
  private avatarImagePath=this.baseImageUrl+'/uploads/avatar/动漫/6.jpg';
  private getAvatarImageUrl(user){
    if(user.avatar){
      if(user.avatarUseImg==1){
        //说明是上传的图片
        return this.baseImageUrl+'/uploads/'+user.avatar;
      }
      else{
        return this.baseImageUrl+user.avatar
      }
    }
    else{
      return this.avatarImagePath;
    }
  }


  private onSubmit(){
    this.userService.edit(this.user).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.getData();
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  @ViewChild('itemListRef')tpl: TemplateRef<any>;
  private dialog;
  private sysAvatars=[];
  private serverpath=new OptConfig().serverPath;
  private changeAvatar(actionTemplate: TemplateRef<any>){
    this.dialog=this.dialogService.open({
      title: "替换头像",
      content: this.tpl,
      actions:actionTemplate,
    });

    this.userService.sysAvatar().then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          //把路径补充完整
          this.sysAvatars=result.data;
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )


  }
  private cancel(){
    this.dialog.close();
  }
  private header=new Headers({'Content-Type': 'multipart/form-data'});
  private uploadSaveUrl=new OptConfig().serverPath+'/api/user/uploadAvatar';

  private myRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.png','.jpeg']
  };

  private successResult($event){
    console.log($event);
    let res=$event.response;
    let json=res.json();
    if(json&&json.data&&json.data.avatar){
      let avatarNow=json.data.avatar;
      let avatarType=json.data.avatarUseImg?json.data.avatarUseImg:0;
      this.user.avatar=avatarNow;
      this.user.avatarUseImg=1;
      this.missionService.changeAvatar.emit(new Avatar(avatarNow,avatarType));
      this.dialog.close();
    }
  }
  private errorResult($event){
    console.log($event);
  }

  private changeSysAvatar(img){
    this.userService.setSysAvatar({img:img}).then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          //this.getData();
          this.user.avatar=img;
          this.user.avatarUseImg=0;
          this.missionService.changeAvatar.emit(new Avatar(img,0));
          this.dialog.close();
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }


}
