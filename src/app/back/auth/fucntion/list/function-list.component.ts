import {Component,OnInit,ViewChild} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';

import {PageChangeEvent,GridDataResult} from '@progress/kendo-angular-grid';
import {DialogService,DialogRef,DialogCloseResult,DialogResult} from '@progress/kendo-angular-dialog';
import {GridComponent} from '@progress/kendo-angular-grid';

import {FunctionService} from "../function.service";
import {ApiResultService} from "../../../main/apiResult.service";
import {AjaxExceptionService} from "../../../main/ajaxExceptionService";
import {OptConfig} from "../../../../config/config";
import {SwitchService} from "../../../main/switchService";
import {MissionService} from "../../../main/mission.service";

@Component({
  selector:'function-list',
  templateUrl:'./function-list.component.html',
  styleUrls:['./function-list.component.scss']
})

export class FunctionListComponent implements OnInit{

  private gridData:GridDataResult={
    data:[],
    total:0
  };

  private height:number=0;
  private result;
  private isLoading:boolean=true;

  constructor(
    private functionService:FunctionService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private dialogService:DialogService,
    private switchService:SwitchService,
    private missionService:MissionService
  ){
  };

  ngOnInit(){
    this.height=(window.document.body.clientHeight-70-56-50-20-27);
    this.auth();
    this.getData();
  }

  //从user对象中，找出对应该页面的auths数组
  private subscription;
  private pageAuths=[];
  private showAddBtn:boolean=false;
  private showListEditBtn:boolean=false;
  private showListDeleteBtn:boolean=false;
  private auth(){
    let user=this.switchService.getUser();
    if(user){
      //main组件早已经加载完毕的情况
      this.pageAuths=this.initAuth('function');
      this.initComponentAuth();
    }
    else{
      //和main组件一同加载的情况
      this.subscription=this.missionService.hasAuth.subscribe(()=>{
        this.pageAuths=this.initAuth('function');
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
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='add'){
        this.showAddBtn=true;
      }
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='edit'){
        this.showListEditBtn=true;
      }
      if(auth.opInFunc&&auth.opInFunc.operate&&auth.opInFunc.operate.code&&auth.opInFunc.operate.code=='delete'){
        this.showListDeleteBtn=true;
      }
    }
  }

  @ViewChild('funcGrid') funcGrid: GridComponent;
  private getData(){
    this.isLoading=true;
    this.functionService.getList()
      .then(
        data=>{
          let functionResult=this.apiResultService.result(data);
          console.log(functionResult);
          if(functionResult&&functionResult.status==0){
            let functions = this.apiResultService.result(data).data;
            this.functionService.getOpList().then(
              data=>{
                console.log(data);
                let result=this.apiResultService.result(data);
                if(result&&result.status==0){
                  let operates=result.data;
                  //根据operates改造functionList
                  for(let f of functions){
                    let array2=[];
                    for(let os of operates){
                      let newObj={};
                      for(let p in os){
                        newObj[p]=os[p];
                      }
                      array2.push(newObj);
                    }
                    f.viewOp=array2;

                    for(let vo of f.viewOp){
                      vo.checked=this.isExistInArray(vo.id,f.ops);
                      console.log(vo);
                    }
                  }
                  //this.gridData.data=functions;
                  //console.log(this.gridData.data);
                  //将functions对象，变成两层的父子关系
                  let newFunctions=[];
                  for(let f of functions){
                    if(f.class==0){
                      f.children=[];
                      newFunctions.push(f);
                    }
                  }

                  for(let f of functions){
                    for(let nf of newFunctions){
                      if(f.belong==nf.id){
                        nf.children.push(f);
                      }
                    }
                  }

                  this.gridData.data=newFunctions;

                  console.log(this.gridData.data);
                  setTimeout(()=>{
                    for(let i=0;i<newFunctions.length;i++)
                      this.funcGrid.expandRow(i);
                  },0)
                  this.isLoading=false;
                }
              },
              error=>{
                this.isLoading=false;
                this.ajaxExceptionService.simpleOp(error);
              }
            )
          }
          this.isLoading=false;
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
          this.isLoading=false;
        }
      );
  }

  private add(){
    this.router.navigate(['add'],{relativeTo:this.route.parent});
  }

  private isExistInArray(id,array){
    let i=0;
    for(let a of array){
      if(id==a.opId){
        return true;
      }
      else{
        if(i==array.length-1){
          return false;
        }
      }
      i++;
    }
    return false;
  }

  private opChange($event,opId,funcId,dataObj){
    let chk=$event.target.checked;
    if(chk){
      this.functionService.createAuth({funcId:funcId,opId:opId}).then(
        data=>{
          let result=this.apiResultService.result(data);
          if(result&&result.status===0){

          }
          else{
            dataObj.checked=false;
          }
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
          dataObj.checked=false;
        }
      )
    }
    else{
      this.functionService.deleteAuth({funcId:funcId,opId:opId}).then(
        data=>{
          let result=this.apiResultService.result(data);
          if(result&&result.status===0){

          }
          else{
            dataObj.checked=true;
          }
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
          dataObj.checked=true;
        }
      )
    }

  }

  private refresh(){
    this.gridData.data=[];
    this.gridData.total=0;
    this.isLoading=true;
    this.getData();
  }
}
