import {Component,OnInit} from '@angular/core';
import {BusinessContentService} from "./businessContent.service";
import {ApiResultService} from "../../main/apiResult.service";
import {AjaxExceptionService} from "../../main/ajaxExceptionService";
import {EquipType} from "../../../bean/equipType";

@Component({
  selector:'equip-type',
  template:`
    <div *ngFor="let et of equiptypes">
      {{et.name}}{{et.code}}{{et.id}}
    </div>
    <input type="text" ([ngModel])="equiptype.name" >
    <input type="text" ([ngModel])="equiptype.code" >
    <button (click)="savetype()"></button>
  `
})

export class EquipTypeComponent implements OnInit{

  private equiptypes:EquipType[]=[];
  private equiptype=new EquipType(null,null,null);

  constructor(
    private businessContentService:BusinessContentService,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService
  ){
  };

  ngOnInit(){
    //this.getData();
  }
  private getData(){
/*    this.businessContentService.getType().then(
      data=>{
        let result=this.apiResultService.result(data);
        if(result.status==0){
          let o=EquipType.fromJSON(result.data);
          console.log(o);
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )*/
    this.equiptypes.push(new EquipType('123','123','123'));
  }
  private savetype(){
    this.businessContentService.createType(this.equiptype).then(
      data=>{
        this.apiResultService.result(data);
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    );
  }
}
