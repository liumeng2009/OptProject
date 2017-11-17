import {NgModule} from '@angular/core';
import {ModuleWithProviders} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';

import {RegComponent} from './register/reg.component';

import {MainComponent} from './main/main.component';


import {BasicSettingsComponent} from './basicSettings/baseSettings.component';

import {AddressComponent} from './basicSettings/address/address.component';
import {AddressListComponent} from './basicSettings/address/list/address-list.component';
import {AddressAddComponent} from './basicSettings/address/add/address-add.component';
import {AddressEditComponent} from './basicSettings/address/edit/address-edit.component';

import {GroupComponent} from './basicSettings/group/group.component';
import {GroupListComponent} from './basicSettings/group/list/group-list.component';
import {GroupAddComponent} from './basicSettings/group/add/group-add.component';
import {GroupEditComponent} from './basicSettings/group/edit/group-edit.component';

import {WorkerComponent} from './basicSettings/worker/worker.component';

import {OperationsComponent} from './operations/operations.component';
import {OperationListComponent} from './operations/list/operation_list.component';

import {TotalComponent} from './total/total.component';

import {CorporationComponent} from "./basicSettings/corporation/corporation.component";
import {CorporationListComponent} from "./basicSettings/corporation/list/corporation-list.component";
import {CorporationAddComponent} from "./basicSettings/corporation/add/corporation-add.component";
import {CorporationEditComponent} from "./basicSettings/corporation/edit/corporation-edit.component";

import {AuthComponent} from "./auth/auth.component";

import {UserListComponent} from "./auth/user/list/user-list.component";
import {UserComponent} from "./auth/user/user.component";
import {UserAddComponent} from "./auth/user/add/user-add.component";
import {UserEditComponent} from "./auth/user/edit/user-edit.component";

import {BusinessContentComponent} from './operations/businessContents/businessContent.component';
import {BusinessContentListComponent} from './operations/businessContents/list/business-content-list.component';
import {BusinessContentAddComponent} from './operations/businessContents/add/business-content-add.component';
import {BusinessContentEditComponent} from './operations/businessContents/edit/business-content-edit.component';

import {OtherComponent} from "./components/other.component";
import {OrderComponent} from "./operations/order/order.component";
import {OrderListComponent} from "./operations/order/list/order-list.component";
import {OrderAddComponent} from "./operations/order/add/order-add.component";
import {OrderEditComponent} from "./operations/order/edit/order-edit.component";
import {OperationEditComponent} from "./operations/edit/operation_edit.component";

export const PanelbarRoutes:Routes=[
  {path:'',redirectTo:'/admin/total',pathMatch:'full',data:{name:'首页'}},
  {path:'login',component:LoginComponent,data:{name:'登录'}},
  {path:'reg',component:RegComponent,data:{name:'注册'}},
  {path:'admin',component:MainComponent,data:{name:'首页'},children:[
    {path:'total',component:TotalComponent,data:{name:'数据综述'},},
    {path:'basic',component:BasicSettingsComponent,data:{name:'基本设置'},children:[
      { path: 'address' ,component: AddressComponent,data:{name:'地址设置'},children:[
        {path:'list',component:AddressListComponent,data:{name:'列表'}},
        {path:'add',component:AddressAddComponent,data:{name:'新增'}},
        {path:':id',component:AddressEditComponent,data:{name:'编辑'}}
      ] },
      { path: 'group' ,component: GroupComponent,data:{name:'组织设置'},children:[
        {path:'list',component:GroupListComponent,data:{name:'列表'}},
        {path:'add',component:GroupAddComponent,data:{name:'新增'}},
        {path:':id',component:GroupEditComponent,data:{name:'编辑'}}
      ] },
      { path: 'corporation' ,component: CorporationComponent,data:{name:'公司设置'},children:[
        {path:'list',component:CorporationListComponent,data:{name:'列表'}},
        {path:'add',component:CorporationAddComponent,data:{name:'新增'}},
        {path:':id',component:CorporationEditComponent,data:{name:'编辑'}}
      ] },
      { path: 'worker', component: WorkerComponent,data:{name:'工程师设置'} }
    ]},
    {path:'operations',data:{name:'工作管理'},children:[
      { path: 'op', component: OperationsComponent,data:{name:'工单'},children:[
        {path:'list',component:OperationListComponent,data:{name:'列表'}},
        {path:'add',component:OperationEditComponent,data:{name:'新增'}},
        {path:':id',component:OperationEditComponent,data:{name:'编辑'}}
      ] },
      { path: 'order', component: OrderComponent,data:{name:'客户需求'},children:[
        {path:'list',component:OrderListComponent,data:{name:'列表'}},
        {path:'add',component:OrderAddComponent,data:{name:'新增'}},
        {path:':id',component:OrderEditComponent,data:{name:'编辑'}}
      ] },
      { path: 'business', component: BusinessContentComponent,data:{name:'业务内容设置'},children:[
        {path:'list',component:BusinessContentListComponent,data:{name:'列表'}},
        {path:'add',component:BusinessContentAddComponent,data:{name:'新增'}},
        {path:':id',component:BusinessContentEditComponent,data:{name:'编辑'}}
      ] }
    ]},
    {path:'auth',component:AuthComponent,data:{name:'用户权限管理'},children:[
      { path: 'user', component: UserComponent,data:{name:'用户管理'},children:[
        {path:'list',component:UserListComponent,data:{name:'列表'}},
        {path:'add',component:UserAddComponent,data:{name:'新增'}},
        {path:':id',component:UserEditComponent,data:{name:'编辑'}}
      ] }
    ]}
  ]},
  {path:'**',component:OtherComponent,data:{name:'页面未找到'}}
];

export const appRoutingProvider:any[]=[];

export const panelbarRouting:ModuleWithProviders=RouterModule.forRoot(PanelbarRoutes);


/*
@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})

export class AppRoutingModule{}
*/
