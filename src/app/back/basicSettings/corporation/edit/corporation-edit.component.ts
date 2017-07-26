import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import {Corporation} from "../../../../bean/corporation";
import {CorporationService} from "../corporation.service";
import {ApiResultService} from "../../../main/apiResult.service";
import {AjaxExceptionService} from "../../../main/ajaxExceptionService";
import {MissionService} from "../../../main/mission.service";
import {AlertData} from "../../../../bean/alertData";
import {OptConfig} from "../../../../config/config";
import {GroupService} from "../../group/group.service";
import {Group} from "../../../../bean/group";
import {CorpBuilding} from "../../../../bean/corpBuilding";
import {CorpBuildingService} from '../corpBuilding.service';
import {AddressService} from '../../address/address.service';
import {Building} from "../../../../bean/building";
import {max} from "rxjs/operator/max";

const formGroup = dataItem => new FormGroup({
  'buildingId': new FormControl(dataItem.buildingId),
  'floor': new FormControl(dataItem.floor),
  'position': new FormControl(dataItem.position)
});

@Component({
  selector:'corporation-edit',
  templateUrl:'./corporation-edit.component.html',
  styleUrls:['./corporation-edit.component.scss']
})

export class CorporationEditComponent implements OnInit{
  corporation=new Corporation('','','','',1);

  corpBuildings:CorpBuilding[];
  groups:Group[];
  buildings:Building[];
  floors:number[]=[];
  positions:any[]=[];

  isLoading:boolean=false;
  isCorpBuildingLoading:boolean=false;
  isBuildingLoading:boolean=false;

  private formGroup: FormGroup;
  private editedRowIndex: number;

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private missionService:MissionService,
    private corporationService:CorporationService,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private groupService:GroupService,
    private corpBuildingService:CorpBuildingService,
    private addressService:AddressService
  ){}

  ngOnInit(){
    this.route.params.subscribe((params: Params) =>{
      this.getData(params.id);
    })
    this.setGroupData();
    this.setCorpBuildingData();
    this.setBuildingData();

    let posEast=new Map().set('E','东');
    let posWest=new Map().set('W','西');
    let posSouth=new Map().set('S','南');
    let posNorth=new Map().set('N','北');
    let posAll=new Map().set('A','所有区域');
    this.positions.push(posEast);
    this.positions.push(posWest);
    this.positions.push(posSouth);
    this.positions.push(posNorth);
    this.positions.push(posAll);
  }
  private setGroupData(){
    this.isLoading=true;
    this.groupService.getGroupList(null)
      .then(
        data=>{
          if(this.apiResultService.result(data)) {
            this.groups= this.apiResultService.result(data).data;
          }
          this.isLoading=false;
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
          this.isLoading=false;
        }
      );
  }

  private setBuildingData(){
    this.isBuildingLoading=true;
    this.addressService.getAddressList(null)
      .then(
        data=>{
          if(this.apiResultService.result(data)) {
            this.buildings= this.apiResultService.result(data).data;
            //alert(JSON.stringify(this.buildings));
          }
          this.isBuildingLoading=false;
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
          this.isBuildingLoading=false;
        }
      );
  }

  private buildingChange(event){
    this.floors.splice(0,this.floors.length);
    let minfloor=event.minfloor;
    let maxfloor=event.maxfloor;
    for(var i=minfloor;i<maxfloor+1;i++){
      this.floors.push(i);
    }
  }

  private setCorpBuildingData(){
    this.isCorpBuildingLoading=true;
    this.route.params.subscribe((params: Params) =>{
      let corpid=params.id;
      this.corpBuildingService.getCorporationList(corpid).then(
        data=>{
          if(this.apiResultService.result(data)) {
            this.corpBuildings= this.apiResultService.result(data).data;
          }
          this.isCorpBuildingLoading=false;
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
          this.isCorpBuildingLoading=false;
        }
      )
    })
  }

  private getData(id){
    this.corporationService.getCorporation(id).then(
      data=>{
        console.log(data);
        let corporationobj=this.apiResultService.result(data);
        if(corporationobj){
          this.corporation.name=corporationobj.data.name;
          this.corporation.description=corporationobj.data.description;
          this.corporation.groupId=corporationobj.data.groupId;
          this.corporation.id=corporationobj.data.id;
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
  private onSubmit1(){
    alert('heihei');
  }

  protected addHandler({sender}) {
    if(this.buildings.length>0){
      let minfloor=this.buildings[0].minfloor;
      let maxfloor=this.buildings[0].maxfloor;
      for(var i=minfloor;i<maxfloor+1;i++){
        this.floors.push(i);
      }
    }
    this.closeEditor(sender);
    alert(this.floors[0]);
    this.formGroup =formGroup({
      'buildingId':this.buildings.length>0?this.buildings[0].id:'',
      'floor': this.floors.length>0?this.floors[0]:0,
      'position': "",
    });
    sender.addRow(this.formGroup);
  }

  protected editHandler({sender, rowIndex, dataItem}) {
/*    this.closeEditor(sender);

    this.formGroup = new FormGroup({
      'ProductID': new FormControl(dataItem.ProductID),
      'ProductName': new FormControl(dataItem.ProductName, Validators.required),
      'UnitPrice': new FormControl(dataItem.UnitPrice),
      'UnitsInStock': new FormControl(dataItem.UnitsInStock, Validators.compose([Validators.required, Validators.pattern('^[0-9]{1,2}')])),
      'Discontinued': new FormControl(dataItem.Discontinued)
    });

    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);*/
  }

  protected cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

/*  protected saveHandler({sender, rowIndex, formGroup, isNew}) {
    const product: Product = formGroup.value;

    this.editService.save(product, isNew);

    sender.closeRow(rowIndex);
  }

  protected removeHandler({dataItem}) {
    this.editService.remove(dataItem);
  }*/



}
