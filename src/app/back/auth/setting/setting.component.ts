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

  private baseImageUrl: string = new OptConfig().serverPath+ "/uploads/";
  private avatarImagePath=this.baseImageUrl+'avatar/dongman/6.jpg';
  private getAvatarImageUrl(avatar){
    if(avatar){
      return this.baseImageUrl+avatar;
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
  private changeAvatar(actionTemplate: TemplateRef<any>){
    this.dialog=this.dialogService.open({
      title: "替换头像",
      content: this.tpl,
      actions:actionTemplate,
    });
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
      this.missionService.changeAvatar.emit(new Avatar(avatarNow,avatarType));
    }


  }
  private errorResult($event){
    console.log($event);
  }


}
