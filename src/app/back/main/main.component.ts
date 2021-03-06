import {Component,OnInit,ViewContainerRef,HostListener,ElementRef,ViewEncapsulation,ViewChild } from '@angular/core';
import {Router,ActivatedRoute,NavigationEnd} from '@angular/router'
import {Location} from '@angular/common';
import {Title} from '@angular/platform-browser';

import {OptConfig} from "../../config/config";
import {CookieService} from "angular2-cookie/core";

import {PanelBarItemModel} from "@progress/kendo-angular-layout";

import {User} from '../../bean/user'
import {AlertData} from '../../bean/alertData'
import {Bread} from '../../bean/bread'


import {MainService} from './main.service'
import {MissionService} from "./mission.service";

import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {ApiResultService} from "./apiResult.service";
import {AjaxExceptionService} from "./ajaxExceptionService";

import '../app-routing.module.ts';


import {BasicSettingsComponent} from '../basicSettings/baseSettings.component';

import {AddressComponent} from '../basicSettings/address/address.component';
import {AddressListComponent} from '../basicSettings/address/list/address-list.component';
import {AddressAddComponent} from '../basicSettings/address/add/address-add.component';
import {AddressEditComponent} from '../basicSettings/address/edit/address-edit.component';

import {AddComponent} from './add.component'
import {SwitchService} from "./switchService";
import {Avatar} from "../../bean/avatar";


@Component({
  selector:'main-area',
  templateUrl:'./main.component.html',
  styleUrls:['./main.component.scss']
})

export class MainComponent implements OnInit{
   user:User;
   selectedId:string='';
   routerCopy:Router;
   breadcrumb:Bread[]=[]

   mySubscription;
   avatarSubscription;

   showPage='hidden';

  constructor(
    private router:Router,
    private mainService:MainService,
    private cookieService:CookieService,
    private location:Location,
    private route:ActivatedRoute,
    private title:Title,
    private missionService:MissionService,
    private toastr:ToastsManager,
    private vcr:ViewContainerRef,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private switchService:SwitchService
  ){
    this.routerCopy=router;

    this.toastr.setRootViewContainerRef(vcr);

    let toastrOption={
      showCloseButton:true
    }

    this.switchService.setIsIntoMain(true);

    //操作信息的消息接收
    this.mySubscription=missionService.change.subscribe((alertData:AlertData)=>{
      if(alertData.type=='success'){
        this.toastr.success(alertData.info,'',toastrOption);
      }
      else if(alertData.type=='danger'){
        this.toastr.error(alertData.info,'',toastrOption);
      }else if(alertData.type=='info'){
        this.toastr.info(alertData.info,'',toastrOption);
      }
      else{
        this.toastr.warning(alertData.info,'',toastrOption);
      }

    });

    missionService.remove.subscribe((str:string)=>{
      if(str=='remove'){
        this.mySubscription.unsubscribe();
      }
    });

    this.avatarSubscription=missionService.changeAvatar.subscribe((avatarNew:Avatar)=>{
      this.user.avatar=avatarNew.path;
      this.user.avatarUseImg=avatarNew.type;
    })


  }

   topNumber={
    position:'relative',
    top:'0px'
  };
  ngOnInit(){
    let $t=this;
    window.onscroll=function(){
      let topNum=document.documentElement.scrollTop;
      $t.topNumber.top=topNum+'px';
    }
    this.checkLogin();


    let url=this.location.path();
    url=url.substring(1,url.length);
    this.selectedId=url;

    this.createBreadCrumb();

    let t=this;
    //   /admin默认跳转到/admin/total
    if(url=='admin'){
      this.router.navigate(['/admin/total']).then(function(){
        t.selectedId='admin/total';
        t.createBreadCrumb();
      });
    }

    //起始路由，也会有一些特殊处理
    if(url=='admin/basic/address'){
      this.router.navigateByUrl('/admin/basic/address/list');
    }
    if(url=='admin/basic/group'){
      this.router.navigateByUrl('/admin/basic/group/list');
    }
    if(url=='admin/basic/corporation'){
      this.router.navigateByUrl('/admin/basic/corporation/list');
    }
    if(url=='admin/auth/user'){
      this.router.navigateByUrl('/admin/auth/user/list');
    }
    if(url=='admin/operations/order'){
      this.router.navigateByUrl('/admin/operations/order/list');
    }
    if(url=='admin/operations/op'){
      this.router.navigateByUrl('/admin/operations/op/list');
    }
    if(url=='admin/auth/function'){
      this.router.navigateByUrl('/admin/auth/function/list');
    }
    if(url=='admin/auth/role'){
      this.router.navigateByUrl('/admin/auth/role/list');
    }

    //路由监视，导航到某些特殊路由时，需要做的一些特殊处理.
    this.router.events
      .subscribe((event) => {
        //console.log(event);
        if (event instanceof NavigationEnd) { // 当导航成功结束时执行
          let urlNow=event.url;
          urlNow=urlNow.substring(1,urlNow.length);

          //某些特殊情况的跳转
          //导航到地址，直接跳转到地址列表
          if(event.url=='/admin/basic/address'){
            this.router.navigateByUrl('/admin/basic/address/list');
          }
          if(event.url=='/admin/basic/group'){
            this.router.navigateByUrl('/admin/basic/group/list');
          }
          if(event.url=='/admin/basic/corporation'){
            this.router.navigateByUrl('/admin/basic/corporation/list');
          }
          if(event.url=='/admin/auth/user'){
            this.router.navigateByUrl('/admin/auth/user/list');
          }
          if(event.url=='/admin/operations/business'){
            this.router.navigateByUrl('/admin/operations/business/list');
          }
          if(event.url=='/admin/operations/order'){
            this.router.navigateByUrl('/admin/operations/order/list');
          }
          if(event.url=='/admin/operations/op'){
            this.router.navigateByUrl('/admin/operations/op/list');
          }
          if(event.url=='/admin/auth/function'){
            this.router.navigateByUrl('/admin/auth/function/list');
          }
          if(event.url=='/admin/auth/role'){
            this.router.navigateByUrl('/admin/auth/role/list');
          }

          //导航到首页，直接跳转到数据综述
          if(event.url=='/admin'){
            this.router.navigateByUrl('/admin/total');
          }

          //当到达login界面时，取消toast的消息订阅
          if(event.url=='/login'){
            this.mySubscription.unsubscribe();
            this.avatarSubscription.unsubscribe();
          }


          //某些特殊情况的selectedId处理
          //当url是地址列表，将选中的selectedid值设置为地址功能页
          if(event.url.indexOf('/admin/basic/address/')>-1){
            this.selectedId='admin/basic/address';
          }
          else if(event.url.indexOf('/admin/basic/group/')>-1){
            this.selectedId='admin/basic/group';
          }
          else if(event.url.indexOf('/admin/basic/corporation/')>-1){
            this.selectedId='admin/basic/corporation';
          }
          else if(event.url.indexOf('/admin/auth/user/')>-1){
            this.selectedId='admin/auth/user';
          }
          else if(event.url.indexOf('/admin/operations/business/')>-1){
            this.selectedId='admin/operations/business';
          }
          else if(event.url.indexOf('/admin/operations/order/')>-1){
            this.selectedId='admin/operations/order';
          }
          else if(event.url.indexOf('/admin/operations/op/')>-1){
            this.selectedId='admin/operations/op';
          }
          else if(event.url.indexOf('/admin/auth/function/')>-1){
            this.selectedId='admin/auth/function';
          }
          else if(event.url.indexOf('/admin/auth/role/')>-1){
            this.selectedId='admin/auth/role';
          }
          else{
            this.selectedId=urlNow;
          }
          this.searchAndDeleteNodePropertySelected(this.router.config);
          this.createBreadCrumb();
        }
      });
  }

   checkLogin(){
    this.mainService.getUserInfo()
      .then(
        data=>{
          let result=this.apiResultService.result(data);
          if(result&&result.status==0){
            this.user =result.data;
            this.switchService.setUser(this.user);
            //console.log('更新存储的身份信息');
            setTimeout(()=>{
              this.missionService.hasAuth.emit('hasauth');
            },0)
            this.fixRouteConfig(result.data.role.auths);
          }
        },
        error=>{
          this.ajaxExceptionService.simpleOp(error);
        }
      );
  }

  //根据角色，来改变angular的路由配置
   fixRouteConfig(auths){
    //auths与route作比较，auths中没有的，从route中删除
    //第一层
    let cfg=this.router.config[3].children;
    for(let i=1;i<cfg.length;i++){
      // 为了简便，让小工具页面可以显示在页面上，而不需要权限的验证
      if(i === 3) {
        continue;
      }
      if(this.isExistInRouteConfig(cfg[i],auths)){

      }
      else{
        //没有菜单权限，就把这个分支从config删除掉
        cfg.splice(i,1);
        console.log('删除了'+cfg[i]);
        i--;
      }
      //第二层
      let cfgChildren=cfg[i].children;

      for(let j=0;j<cfgChildren.length;j++){
        if(this.isExistInRouteConfig(cfgChildren[j],auths)){

        }
        else{
          //没有菜单权限，就把这个分支从config删除掉
          cfgChildren.splice(j,1);
          console.log('删除了'+cfgChildren[j]);
          j--;
        }
      }



    }
  }

   isExistInRouteConfig(pathObj,auths){
    for(let auth of auths){
      if(pathObj.path==auth.opInFunc.function.code&&auth.opInFunc.operate.code=='menu'){
        return true;
      }
    }
    return false;
  }

   createBreadCrumb(){

    this.breadcrumb.splice(0,this.breadcrumb.length);

    let firstBread:Bread={
      name:'首页',
      path:'/admin'
    };
    this.title.setTitle(firstBread.name);
    this.breadcrumb.push(firstBread);
    if(this.route.firstChild){
      let secondBread:Bread={
        name:'',
        path:''
      };

      this.breadcrumb.push(secondBread);

      this.route.firstChild.data.subscribe((data => {
        this.breadcrumb[1].name=data.name
        this.title.setTitle(data.name)
      }));

      this.route.firstChild.url.subscribe((url => {
        this.breadcrumb[1].path=this.breadcrumb[0].path+'/'+url[0].path;
      }));
    }
    if(this.route.firstChild&&this.route.firstChild.firstChild){
      let thirdBread:Bread={
        name:'',
        path:''
      };

      this.breadcrumb.push(thirdBread);

      this.route.firstChild.firstChild.data.subscribe((data => {
        this.breadcrumb[2].name=data.name
        this.title.setTitle(data.name);
      }));

      this.route.firstChild.firstChild.url.subscribe((url => {
        this.breadcrumb[2].path=this.breadcrumb[1].path+'/'+url[0].path;
      }));
    }

    if(this.route.firstChild&&this.route.firstChild.firstChild&&this.route.firstChild.firstChild.firstChild){
      let fourBread:Bread={
        name:'',
        path:''
      };

      this.breadcrumb.push(fourBread);

      this.route.firstChild.firstChild.firstChild.data.subscribe((data => {
        this.breadcrumb[3].name=data.name
        this.title.setTitle(this.breadcrumb[2].name+'-'+data.name);
      }));

      this.route.firstChild.firstChild.firstChild.url.subscribe((url => {
        this.breadcrumb[3].path=this.breadcrumb[2].path+'/'+url[0].path;
      }));
    }

  }

  public stateChange(data:Array<PanelBarItemModel>):boolean{
    let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];
    this.createBreadCrumb();

    this.selectedId = focusedEvent.id;
    let t=this;

    let intoOtherUrl:string;
    //if(focusedEvent.id=='admin/basic/address'){
    //  intoOtherUrl='admin/basic/address';
    //}
    //else{
    intoOtherUrl=focusedEvent.id;
    //}

    this.router.navigate(["/" +intoOtherUrl]).then(function(){
      //alert('检查登录1');
      //t.checkLogin();
      t.createBreadCrumb();
    });

    //路由的data属性中，有selected属性，这个属性是为了载入时，正确显示菜单选中状态的。当路由发生改变，需要把这个属性删除。只有笨办法，遍历路由树。
    this.searchAndDeleteNodePropertySelected(this.router.config);

    return false;
  }

   searchAndDeleteNodePropertySelected(routes:any[]){
    for(let i=0;i<routes.length;i++){
      if(routes[i].data.selected){
        delete routes[i].data.selected;
      }
      if(routes[i].children){
        this.searchAndDeleteNodePropertySelected(routes[i].children);
      }
    }
  }

   baseImageUrl: string = new OptConfig().serverPath;
   avatarImagePath=this.baseImageUrl+'/uploads/avatar/动漫/6.jpg';
   getAvatarImageUrl(user){
    if(user){
      if(user.avatar){
        if(user.avatarUseImg==1){
          //说明是上传的图片
          return this.baseImageUrl+'/uploads/'+user.avatar;
        }
        else{
          return this.baseImageUrl+user.avatar
        }
      }
      else{
        return this.avatarImagePath;
      }
    } else {
      return '';
    }

  }


   imageUrl(imageName: string) :string {
    return this.baseImageUrl + imageName + ".jpg";
  }

   logout(){
    this.cookieService.remove('optToken');
    let toastrOption={
      showCloseButton:true
    }
    this.toastr.warning(new OptConfig().closing,'',toastrOption);
    setTimeout(()=>{
      this.routerCopy.navigateByUrl('login');
    },2000);
  }

   back(){
    let historyGo=-1;
    let url=this.location.path();
    url=url.substring(1,url.length);
    //起始路由，也会有一些特殊处理
    if(url=='admin/basic/address/list'){
      historyGo=-2;
    }
    if(url=='admin/basic/group/list'){
      historyGo=-2;
    }
    if(url=='admin/basic/corporation/list'){
      historyGo=-2;
    }
    if(url=='admin/operations/order/list'){
      historyGo=-2
    }
    if(url=='admin/operations/business/list'){
      historyGo=-2
    }
    if(url=='admin/auth/user/list'){
      historyGo=-2
    }
    window.history.go(historyGo);
  }

   gotoUserPage(){
    this.router.navigate(["/admin/auth/setting"])
  }

   showUserMenu:boolean=false;
   onToggleUserMenu(){
    if(this.showUserMenu){
      this.showUserMenu=false;
    }
    else{
      this.showUserMenu=true;
    }
  }

   showMessageArea:boolean=false;
   onToggleMessageArea(){
    if(this.showMessageArea){
      this.showMessageArea=false;
    }
    else{
      this.showMessageArea=true;
    }
  }

  @ViewChild('anchor') public anchorOp: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popupOp: ElementRef;
   contains(target: any): boolean {
    return this.anchorOp.nativeElement.contains(target) ||
      (this.popupOp ? this.popupOp.nativeElement.contains(target): false);
  }

  @ViewChild('messageArea') public messagearea: ElementRef;
  @ViewChild('popupMessage', { read: ElementRef }) public popupmessage: ElementRef;
   containsMessage(target: any): boolean {
    return this.messagearea.nativeElement.contains(target) ||
      (this.popupmessage ? this.popupmessage.nativeElement.contains(target): false);
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.showUserMenu=false;
    }
    if (!this.containsMessage(event.target)) {
      this.showMessageArea=false;
    }
  }

}
