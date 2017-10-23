import {Component,OnInit,ViewChild,AfterViewInit} from '@angular/core';
import {Router,ActivatedRoute,Params} from '@angular/router';

import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { FormGroup, FormControl, Validators } from '@angular/forms';

import {DialogService,DialogRef,DialogCloseResult,DialogResult} from '@progress/kendo-angular-dialog';

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
import {Floor} from "../../../../bean/floor";
import {Position} from "../../../../bean/position";

import {GridComponent} from '@progress/kendo-angular-grid';
import {SwitchService} from "../../../main/switchService";


const formGroup = dataItem => new FormGroup({
  'id':new FormControl(dataItem.id),
  'buildingId': new FormControl(dataItem.buildingId),
  'floor': new FormControl(dataItem.floor),
  'position': new FormControl(dataItem.position)
});

@Component({
  selector:'corporation-edit',
  templateUrl:'./corporation-edit.component.html',
  styleUrls:['./corporation-edit.component.scss']
})

export class CorporationEditComponent implements OnInit,AfterViewInit{
  corporation=new Corporation('','','',null,1);

  corpBuildings:CorpBuilding[];
  groups:Group[];
  buildings:Building[]=[];
  floors:Floor[]=[];
  positions:Position[]=[];

  isLoading:boolean=false;
  isCorpBuildingLoading:boolean=false;
  isBuildingLoading:boolean=false;

  private formGroup: FormGroup;
  private editedRowIndex: number;

  private result;


  @ViewChild(GridComponent) grid: GridComponent;

  constructor(
    private router:Router,
    private route:ActivatedRoute,
    private corporationService:CorporationService,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private groupService:GroupService,
    private corpBuildingService:CorpBuildingService,
    private addressService:AddressService,
    private dialogService:DialogService,
    private switchService:SwitchService
  ){

  }

  ngAfterViewInit() {
    if(this.switchService.getCorpBuildingListAutoAdd()){
      this.myAddRow(this.grid);
      this.switchService.setCorpBuildingListAutoAdd(false);
    }
  }

  private myAddRow(grid){
    this.formGroup =formGroup({
      'buildingId':null,
      'floor': new Floor('全部',0),
      'position': new Position('全部区域','A'),
      'id':''
    });
    console.log(this.formGroup);
    grid.addRow(this.formGroup);
  }

  ngOnInit(){
    this.route.params.subscribe((params: Params) =>{
      this.getData(params.id);
    })
    this.setGroupData();
    this.setCorpBuildingData();
    this.setBuildingData();

    let posEast=new Position('东区','E');
    let posWest=new Position('西区','W');
    let posSouth=new Position('南区','S');
    let posNorth=new Position('北区','N');
    let posAll=new Position('全部区域','A');
    this.positions.push(posAll);
    this.positions.push(posEast);
    this.positions.push(posWest);
    this.positions.push(posSouth);
    this.positions.push(posNorth);
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
            if(this.formGroup&&this.formGroup.value&&(this.formGroup.value.buildingId==''||this.formGroup.value.buildingId==null)){
              this.floors.splice(0,this.floors.length);
              let minfloor=this.buildings.length>0?this.buildings[0].minfloor:0;
              let maxfloor=this.buildings.length>0?this.buildings[0].maxfloor:0;
              let floor=new Floor('全部',0);
              this.floors.push(floor);
              for(var i=minfloor;i<maxfloor+1;i++){
                let floor=new Floor(i.toString(),i);
                this.floors.push(floor);
              }

              this.formGroup =formGroup({
                'buildingId':this.buildings[0],
                'floor': new Floor('全部',0),
                'position': new Position('全部区域','A'),
                'id':''
              });

              //alert('增加');
              this.grid.addRow(this.formGroup);
            }
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
    let floor=new Floor('全部',0);
    this.floors.push(floor);
    for(var i=minfloor;i<maxfloor+1;i++){
      let floor=new Floor(i.toString(),i);
      this.floors.push(floor);
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
            console.log(this.corpBuildings);
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

  private refreshCorpBuilding(){
    this.setCorpBuildingData();
  }

  private getData(id){
    this.corporationService.getCorporation(id).then(
      data=>{
        console.log(data);
        let corporationobj=this.apiResultService.result(data);
        if(corporationobj){
          this.corporation.name=corporationobj.data.name;
          this.corporation.description=corporationobj.data.description;
          this.corporation.group=corporationobj.data.group;
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
    this.corporationService.create(this.corporation).then(
      data=>{
        this.apiResultService.result(data);
        if(data.status==0){
          //this.missionService.change.emit(new AlertData('success','保存成功'));
          //this.toastr.success('保存成功!', 'Success!');
          this.router.navigate(['../'],{relativeTo:this.route});
        }
      },
      error=>{
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  protected addHandler({sender}) {
    if(this.buildings.length>0){
      let floor=new Floor('全部',0);
      this.floors.push(floor);
      let minfloor=this.buildings[0].minfloor;
      let maxfloor=this.buildings[0].maxfloor;
      for(var i=minfloor;i<maxfloor+1;i++){
        let floor=new Floor(i.toString(),i);
        this.floors.push(floor);
      }
    }
    this.closeEditor(sender);
    this.formGroup =formGroup({
      'buildingId':this.buildings.length>0?this.buildings[0]:'',
      'floor': new Floor('全部',0),
      'position': new Position('全部区域','A'),
      'id':''
    });
    sender.addRow(this.formGroup);
  }

  protected editHandler({sender, rowIndex, dataItem}) {
    if(this.buildings.length>0){
      let floor=new Floor('全部',0);
      this.floors.push(floor);
      let minfloor=this.buildings[0].minfloor;
      let maxfloor=this.buildings[0].maxfloor;
      for(var i=minfloor;i<maxfloor+1;i++){
        let floor=new Floor(i.toString(),i);
        this.floors.push(floor);
      }
    }
    console.log(dataItem);

    this.closeEditor(sender);

    let floorObj;
    if(dataItem.floor==0){
      floorObj=new Floor('全部',0);
    }
    else{
      floorObj=new Floor(dataItem.floor.toString(),dataItem.floor);
    }

    let positionObj;
    if(dataItem.position=='A'){
      positionObj=new Position('全部区域','A')
    }
    else if(dataItem.position=='E'){
      positionObj=new Position('东区','E')
    }
    else if(dataItem.position=='S'){
      positionObj=new Position('南区','S')
    }
    else if(dataItem.position=='W'){
      positionObj=new Position('西区','W')
    }
    else if(dataItem.position=='N'){
      positionObj=new Position('北区','N')
    }
    else{
      positionObj=new Position('','')
    }
    console.log(dataItem);
    console.log(floorObj);
    console.log(positionObj);

    dataItem.buildingId=dataItem.building;
    dataItem.floor=floorObj;
    dataItem.position=positionObj;

    this.formGroup = formGroup({
      'buildingId': dataItem.building,
      'floor': dataItem.floor,
      'position':dataItem.position,
      'id':dataItem.id
    });

    console.log(this.formGroup);
    this.editedRowIndex = rowIndex;
    sender.editRow(rowIndex,this.formGroup);
  }

  protected cancelHandler({sender, rowIndex}) {
    this.closeEditor(sender, rowIndex);
  }

  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  protected saveHandler({sender, rowIndex, formGroup, isNew}) {
    this.route.params.subscribe((params: Params) =>{
      let corpid=params.id;

      console.log(formGroup);
      console.log(this.formGroup);

      const corpBuilding: CorpBuilding =formGroup.value;
      corpBuilding.corporationId=corpid;

      console.log(corpBuilding);

      this.corpBuildingService.create(corpBuilding).then(
        data=>{
          this.apiResultService.result(data);
          this.setCorpBuildingData();
          sender.closeRow(rowIndex);
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
        }
      );
    });
  }

  protected removeHandler({dataItem}) {

    const dialog: DialogRef = this.dialogService.open({
      title: "确认删除？",
      content: "确定删除吗？",
      actions: [
        { text: "否" },
        { text: "是", primary: true }
      ]
    });

    dialog.result.subscribe((result) => {
      if (result instanceof DialogCloseResult) {
        console.log("close");
      } else {

      }
      this.result = result;
      if(this.result.text=='是'){
        this.corpBuildingService.delete(dataItem.id).then(
          data=>{
            this.apiResultService.result(data);
            this.setCorpBuildingData();
          },
          error=>{
            this.ajaxExceptionService.simpleOp(error)
          }
        );
      }
    });
  }



}
