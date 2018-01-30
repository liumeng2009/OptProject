import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import {MissionService} from '../../../main/mission.service';

import {RoleService} from '../role.service';
import {AlertData} from "../../../../bean/alertData";

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';
import {User} from "../../../../bean/user";
import {Gender} from "../../../../bean/gender";

@Component({
  selector:'role-add',
  templateUrl:'./role-add.component.html',
  styleUrls:['./role-add.component.scss']
})

export class RoleAddComponent implements OnInit{

  user=new User(null,null,null,true,null,null,true);

  genders=[
    new Gender('男',false),
    new Gender('女',true)
  ]

  constructor(
    private userService:RoleService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService
  ){

  };


  ngOnInit(){

  }

  private onSubmit(){
    console.log(this.user);
    this.userService.create(this.user).then(
      data=>{
        /*
        console.log(data);
        if(data.status==0){
          this.missionService.change.emit(new AlertData('success','保存成功'));
          //this.toastr.success('保存成功!', 'Success!');

        }
        else if(data.status==500){
          this.missionService.change.emit(new AlertData('danger',new OptConfig().unknownError));
        }
        else{
          this.missionService.change.emit(new AlertData('danger',data.message));
        }
*/

        let result=this.apiResultService.result(data);
        if(result&&result.status==0){
          this.router.navigate(['../'],{relativeTo:this.route});
        }
      },
    error=>{
      this.ajaxExceptionService.simpleOp(error);
    }
    )
  }

  private femaleChange($event){
    console.log($event);
    this.user.gender=false;
  }
  private maleChange($event){
    console.log($event);
    this.user.gender=true;
  }
}
