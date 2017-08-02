import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import {Corporation} from '../../../../bean/corporation';
import {Group} from '../../../../bean/group';

import {MissionService} from '../../../main/mission.service';

import {GroupService} from '../../group/group.service';
import {CorporationService} from '../corporation.service';
import {AlertData} from "../../../../bean/alertData";

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';
import {SwitchService} from '../../../main/switchService';

@Component({
  selector:'corporation-add',
  templateUrl:'./corporation-add.component.html',
  styleUrls:['./corporation-add.component.scss']
})

export class CorporationAddComponent implements OnInit{

  corporation=new Corporation('','','','',1);
  groups:Group[];
  isLoading:boolean=false;

  constructor(
    private missionService:MissionService,
    private groupService:GroupService,
    private corporationService:CorporationService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private switchService:SwitchService
  ){

  };


  ngOnInit(){
    this.setGroupData();
  }

  private setGroupData(){
    this.isLoading=true;
    this.groupService.getGroupList(null)
      .then(
        data=>{
          if(this.apiResultService.result(data)) {
            this.groups= this.apiResultService.result(data).data;
            if(this.groups.length>0){
              this.corporation.groupId=this.groups[0].id;
            }
          }
          this.isLoading=false;
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
          this.isLoading=false;
        }
      );
  }

  private onSubmit(){
    //alert(this.building);
    this.corporationService.create(this.corporation).then(
      data=>{
        console.log(data);
        if(data.status==0){
          this.missionService.change.emit(new AlertData('success','保存成功'));
          //this.toastr.success('保存成功!', 'Success!');
          this.router.navigate(['../'],{relativeTo:this.route});
        }
        else if(data.status==500){
          this.missionService.change.emit(new AlertData('danger',new OptConfig().unknownError));
        }
        else{
          this.missionService.change.emit(new AlertData('danger',data.message));
        }
      },
    error=>{
      this.ajaxExceptionService.simpleOp(error);
    }
    )
  }

  private addBuilding(){
    if(this.corporation.name!=''&&this.corporation.description!=''&&this.corporation.groupId!=''){
      //自动新增，然后跳转到edit页面
      this.corporationService.create(this.corporation).then(
        data=>{
          this.apiResultService.result(data);
          let t=this;
          if(data.status==0){
            this.router.navigate(['../'+data.data.id],{relativeTo:this.route}).then(function(){
              t.switchService.setCorpBuildingListAutoAdd(true);
            });
          }
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
        }
      )
    }
    else{
      this.missionService.change.emit(new AlertData('danger','公司信息填写完整才可以编辑公司地点信息'));
    }
    return false;
  }

  private refreshBuilding(){

  }
}
