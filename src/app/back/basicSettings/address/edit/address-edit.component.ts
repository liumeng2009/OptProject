import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import {Building} from "../../../../bean/building";
import {AddressService} from "../address.service";
import {ApiResultService} from "../../../main/apiResult.service";
import {AjaxExceptionService} from "../../../main/ajaxExceptionService";
import {MissionService} from "../../../main/mission.service";
import {AlertData} from "../../../../bean/alertData";
import {OptConfig} from "../../../../config/config";
import {SwitchService} from "../../../main/switchService";

@Component({
  selector:'address-edit',
  templateUrl:'./address-edit.component.html',
  styleUrls:['./address-edit.component.scss']
})

export class AddressEditComponent implements OnInit{

  building=new Building('','','',0,0,1);

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private missionService:MissionService,
    private addressService:AddressService,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private switchService:SwitchService
  ){}

  ngOnInit(){
    this.auth();
    this.route.params.subscribe((params: Params) =>{
      this.getData(params.id);
    })
  }


  //从user对象中，找出对应该页面的auths数组
   subscription;
   pageAuths=[];
   showEditBtn:boolean=false;
   auth(){
    let user=this.switchService.getUser();
    if(user){
      //main组件早已经加载完毕的情况
      this.pageAuths=this.initAuth('address');
      this.initComponentAuth();
    }
    else{
      //和main组件一同加载的情况
      this.subscription=this.missionService.hasAuth.subscribe(()=>{
        this.pageAuths=this.initAuth('address');
        this.initComponentAuth();
      });
    }
  }
   initAuth(functioncode){
    let resultArray=[];
    let user=this.switchService.getUser();
    if(user&&user.role&&user.role.auths){
      let auths=user.role.auths;
      console.log(auths);
      for(let auth of auths){
        if(auth.opInFunc
          &&auth.opInFunc.function
          &&auth.opInFunc.function.code
          &&auth.opInFunc.function.code==functioncode
        ){
          resultArray.push(auth);
        }
      }
    }
    return resultArray;
  }
  //根据auth数组，判断页面一些可操作组件的可用/不可用状态
   initComponentAuth(){
    for(let auth of this.pageAuths){
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='edit'){
        this.showEditBtn=true;

      }
    }
  }


   getData(id){
    this.addressService.getAddress(id).then(
      data=>{
        let buildobj=this.apiResultService.result(data);
        if(buildobj){
          this.building.name=buildobj.data.name;
          this.building.address=buildobj.data.address;
          this.building.minfloor=buildobj.data.minfloor;
          this.building.maxfloor=buildobj.data.maxfloor;
          this.building.id=buildobj.data.id;
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
   onSubmit(){
    //alert(this.building);
    this.addressService.create(this.building).then(
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
