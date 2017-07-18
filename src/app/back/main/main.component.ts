import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router,ActivatedRoute,NavigationEnd} from '@angular/router'
import {Location} from '@angular/common';
import {Title} from '@angular/platform-browser';

import {PanelBarItemModel} from "@progress/kendo-angular-layout";

import {User} from '../../bean/user'
import {AlertData} from '../../bean/alertData'
import {Bread} from '../../bean/bread'


import {MainService} from './main.service'
import {MissionService} from "./mission.service";

import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector:'main-area',
  templateUrl:'./main.component.html',
  styleUrls:['./main.component.scss']
})

export class MainComponent implements OnInit{
  private user:User;
  private selectedId:string='';
  private routerCopy:Router;
  private alertData:AlertData={
    type:'',
    info:''
  }
  private breadcrumb:Bread[]=[]

  private mySubscription;

  constructor(
    private router:Router,
    private mainService:MainService,
    private location:Location,
    private route:ActivatedRoute,
    private title:Title,
    private missionService:MissionService,
    private toastr:ToastsManager,
    private vcr:ViewContainerRef
  ){
    this.routerCopy=router;

    this.toastr.setRootViewContainerRef(vcr);

    let toastrOption={
      showCloseButton:true
    }

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

    })


  }

  ngOnInit(){
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

    //路由监视，导航到某些特殊路由时，需要做的一些特殊处理.
    this.router.events
      .subscribe((event) => {
        console.log(event);
        if (event instanceof NavigationEnd) { // 当导航成功结束时执行
          let urlNow=event.url;
          urlNow=urlNow.substring(1,urlNow.length);

          //某些特殊情况的跳转
          //导航到地址，直接跳转到地址列表
          if(event.url=='/admin/basic/address'){
            this.router.navigateByUrl('/admin/basic/address/list');
          }
          //导航到首页，直接跳转到数据综述
          if(event.url=='/admin'){
            this.router.navigateByUrl('/admin/total');
          }

          //当到达login界面时，取消toast的消息订阅
          if(event.url=='./login'){
            this.mySubscription.unsubscribe();
          }


          //某些特殊情况的selectedId处理
          //当url是地址列表，将选中的selectedid值设置为地址功能页
          if(event.url=='/admin/basic/address/list'||event.url=='/admin/basic/address/add'){
            this.selectedId='admin/basic/address';
          }
          else{
            this.selectedId=urlNow;
            console.log(urlNow);
          }
          this.searchAndDeleteNodePropertySelected(this.router.config);
          this.createBreadCrumb();
        }
      });
  }

  private checkLogin(){
    this.mainService.getUserInfo()
      .subscribe(
        data=>{
          if(data.status==0){
            this.user=data.data;
          }
          else{
            this.router.navigate(['/login']);
          }
        },
        error=>{
          this.router.navigate(['/login']);
        }
      );
  }

  private createBreadCrumb(){

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
      t.checkLogin();
      t.createBreadCrumb();
    });

    //路由的data属性中，有selected属性，这个属性是为了载入时，正确显示菜单选中状态的。当路由发生改变，需要把这个属性删除。只有笨办法，遍历路由树。
    this.searchAndDeleteNodePropertySelected(this.router.config);

    return false;
  }

  private searchAndDeleteNodePropertySelected(routes:any[]){
    for(let i=0;i<routes.length;i++){
      if(routes[i].data.selected){
        delete routes[i].data.selected;
      }
      if(routes[i].children){
        this.searchAndDeleteNodePropertySelected(routes[i].children);
      }
    }
  }

  private baseImageUrl: string = "./assets/image/";

  private imageUrl(imageName: string) :string {
    return this.baseImageUrl + imageName + ".jpg";
  }

  private logout(){
    //this.cookieService.remove('optToken');
    this.alertData={
      type:'info',
      info:'正在退出'
    }
    //let t=this;
    this.routerCopy.navigateByUrl('login');
    //this.router.navigate(["./login"], {relativeTo: this.route.parent});
    //this.user=null;
  }




}
