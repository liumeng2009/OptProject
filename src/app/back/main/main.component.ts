import {Component,OnInit} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router'
import {Location} from '@angular/common';

import {Observable} from 'rxjs/observable';

import {PanelBarItemModel} from "@progress/kendo-angular-layout";

import {User} from '../../bean/user'
import {AlertData} from '../../bean/alertData'
import {Bread} from '../../bean/bread'


import {MainService} from './main.service'

@Component({
  selector:'main-area',
  templateUrl:'./main.component.html',
  styleUrls:['./main.component.scss']
})

export class MainComponent implements OnInit{
  private user:User;
  private router:Router;
  private selectedId:string='';
  alertData:AlertData={
    type:'',
    info:''
  }
  private breadcrumb:Bread[]=[]

  constructor(router:Router,private mainService:MainService,private location:Location,private route:ActivatedRoute){
    this.router=router;
  }

  ngOnInit(){
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
          /*
          this.alertData={
            type:'danger',
            info:<any>error
          }
          */
        }
      );
    let url=this.location.path();
    url=url.substring(1,url.length);
    this.selectedId=url;

    this.createBreadCrumb();

  }

  private createBreadCrumb(){

    this.breadcrumb.splice(0,this.breadcrumb.length);

    let firstBread:Bread={
      name:'首页',
      path:'/admin'
    };

    let secondBread:Bread={
      name:'',
      path:''
    };
    this.breadcrumb.push(firstBread);
    this.breadcrumb.push(secondBread);

    this.route.firstChild.data.subscribe((data => {
      this.breadcrumb[1].name=data.name
    }));

    this.route.firstChild.url.subscribe((url => {
      this.breadcrumb[1].path=this.breadcrumb[0].path+'/'+url[0].path;
    }));
  }

  public stateChange(data:Array<PanelBarItemModel>):boolean{
    let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];

    this.createBreadCrumb();

    this.selectedId = focusedEvent.id;
    this.router.navigate(["/" + focusedEvent.id]);

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
    alert(123);
  }


}
