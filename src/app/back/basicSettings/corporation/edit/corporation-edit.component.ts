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
    private switchService:SwitchService,
    private missionService:MissionService
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
    this.auth();

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


  //从user对象中，找出对应该页面的auths数组
  private subscription;
  private pageAuths=[];
  private showEditBtn:boolean=false;
  //表单内部的grid
  private showListAddBtn:boolean=false;
  private showListEditBtn:boolean=false;
  private showListDeleteBtn:boolean=false;
  private auth(){
    let user=this.switchService.getUser();
    if(user){
      //main组件早已经加载完毕的情况
      this.pageAuths=this.initAuth('corporation');
      this.initComponentAuth();
    }
    else{
      //和main组件一同加载的情况
      this.subscription=this.missionService.hasAuth.subscribe(()=>{
        this.pageAuths=this.initAuth('corporation');
        this.initComponentAuth();
      });
    }
  }
  private initAuth(functioncode){
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
  private initComponentAuth(){
    for(let auth of this.pageAuths){
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='edit'){
        this.showEditBtn=true;
        this.showListEditBtn=true;
        this.showListAddBtn=true;
      }
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='delete'){
        this.showListDeleteBtn=true;
      }
    }
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
          console.log(this.groups);
          console.log(this.corporation);
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

  private buildingChange(event,rowIndex){
    this.floors.splice(0,this.floors.length);
    let minfloor=event.minfloor;
    let maxfloor=event.maxfloor;
    let floor=new Floor('全部',0);
    this.floors.push(floor);
    for(var i=minfloor;i<maxfloor+1;i++){
      let floor=new Floor(i.toString(),i);
      this.floors.push(floor);
    }
    this.corpBuildings[rowIndex].floor=this.floors[0];


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

            //处理一下floor和building的格式
            for(let cb of this.corpBuildings){
              let floorNum=cb.floor;
              let floorObj=new Floor(floorNum.toString(),parseInt(floorNum.toString()));
              cb.floor=floorObj;

              switch(cb.position.toString()){
                case 'A':
                  cb.position=new Position('全部区域',cb.position.toString());
                  break;
                case 'E':
                  cb.position=new Position('东区',cb.position.toString());
                  break;
                case 'S':
                  cb.position=new Position('南区',cb.position.toString());
                  break;
                case 'W':
                  cb.position=new Position('西区',cb.position.toString());
                  break;
                case 'N':
                  cb.position=new Position('北区',cb.position.toString());
                  break;
                default:
                  cb.position=new Position('全部区域',cb.position.toString());
                  break;

              }
            }
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
          this.router.navigate(['../list'],{relativeTo:this.route});
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
      let minfloor=dataItem.building.minfloor;
      let maxfloor=dataItem.building.maxfloor;
      for(var i=minfloor;i<maxfloor+1;i++){
        let floor=new Floor(i.toString(),i);
        this.floors.push(floor);
      }
    }
    console.log(dataItem);

    this.closeEditor(sender);

    let floorObj;
    if(dataItem.floor.value==0){
      floorObj=new Floor('全部',0);
    }
    else{
      floorObj=new Floor(dataItem.floor.name.toString(),dataItem.floor.value);
    }

    let positionObj;
    if(dataItem.position.value=='A'){
      positionObj=new Position('全部区域','A')
    }
    else if(dataItem.position.value=='E'){
      positionObj=new Position('东区','E')
    }
    else if(dataItem.position.value=='S'){
      positionObj=new Position('南区','S')
    }
    else if(dataItem.position.value=='W'){
      positionObj=new Position('西区','W')
    }
    else if(dataItem.position.value=='N'){
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
