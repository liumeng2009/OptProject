import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import {Group} from "../../../../bean/group";
import {GroupService} from "../group.service";
import {ApiResultService} from "../../../main/apiResult.service";
import {AjaxExceptionService} from "../../../main/ajaxExceptionService";
import {MissionService} from "../../../main/mission.service";
import {AlertData} from "../../../../bean/alertData";
import {OptConfig} from "../../../../config/config";

@Component({
  selector:'group-edit',
  templateUrl:'./group-edit.component.html',
  styleUrls:['./group-edit.component.scss']
})

export class GroupEditComponent implements OnInit{

  group=new Group('','','',1);

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private missionService:MissionService,
    private groupService:GroupService,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService
  ){}

  ngOnInit(){
    this.route.params.subscribe((params: Params) =>{
      this.getData(params.id);
    })
  }

  private getData(id){
    this.groupService.getGroup(id).then(
      data=>{
        let buildobj=this.apiResultService.result(data);
        if(buildobj){
          this.group.name=buildobj.data.name;
          this.group.description=buildobj.data.description;
          this.group.id=buildobj.data.id;
        }
        else{
          //编辑页面没有内容，说明内容获取出错，返回list页面
          this.router.navigate(['../'],{relativeTo:this.route});
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
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
