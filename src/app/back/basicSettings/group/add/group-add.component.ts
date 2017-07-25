import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import {Group} from '../../../../bean/group';

import {MissionService} from '../../../main/mission.service';

import {GroupService} from '../group.service';
import {AlertData} from "../../../../bean/alertData";

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';

@Component({
  selector:'group-add',
  templateUrl:'./group-add.component.html',
  styleUrls:['./group-add.component.scss']
})

export class GroupAddComponent implements OnInit{

  group=new Group('','','',1);

  constructor(
    private missionService:MissionService,
    private groupService:GroupService,
    private router:Router,
    private route:ActivatedRoute,
    private ajaxExceptionService:AjaxExceptionService
  ){

  };


  ngOnInit(){
  }

  private onSubmit(){
    //alert(this.building);
    this.groupService.create(this.group).then(
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
}
