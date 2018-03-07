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

import {OtherComponent} from "./components/noFound/other.component";
import {OrderComponent} from "./operations/order/order.component";
import {OrderListComponent} from "./operations/order/list/order-list.component";
import {OrderAddComponent} from "./operations/order/add/order-add.component";
import {OrderEditComponent} from "./operations/order/edit/order-edit.component";
import {OperationEditComponent} from "./operations/edit/operation_edit.component";
import {OperationAddComponent} from "./operations/add/operation_add.component";

import {FunctionComponent} from "./auth/fucntion/function.component";
import {FunctionListComponent} from "./auth/fucntion/list/function-list.component";
import {RoleComponent} from "./auth/role/role.component";
import {RoleListComponent} from "./auth/role/list/role-list.component";
import {RoleAddComponent} from "./auth/role/add/role-add.component";
import {RoleEditComponent} from "./auth/role/edit/role-edit.component";

import {AddComponent} from './main/add.component';

import {AuthGuard} from './main/authGuard.service'

export const PanelbarRoutes:Routes=[
  {path:'',redirectTo:'/admin/total',pathMatch:'full',data:{name:'首页'}},
  {path:'login',component:LoginComponent,data:{name:'登录'}},
  {path:'reg',component:RegComponent,data:{name:'注册'}},
  {path:'admin',component:MainComponent,data:{name:'首页'},children:[
    {path:'total',component:TotalComponent,data:{name:'数据综述'},},
    {path:'basic',component:BasicSettingsComponent,canActivate:[AuthGuard],data:{name:'基本设置'},children:[
      { path: 'address' ,component: AddressComponent,canActivate:[AuthGuard],data:{name:'地址设置'},children:[
        {path:'list',component:AddressListComponent,canActivate:[AuthGuard],data:{name:'列表'}},
        {path:'add',component:AddressAddComponent,canActivate:[AuthGuard],data:{name:'新增'}},
        {path:':id',component:AddressEditComponent,canActivate:[AuthGuard],data:{name:'编辑'}}
      ] },
      { path: 'group' ,component: GroupComponent,canActivate:[AuthGuard],data:{name:'组织设置'},children:[
        {path:'list',component:GroupListComponent,canActivate:[AuthGuard],data:{name:'列表'}},
        {path:'add',component:GroupAddComponent,canActivate:[AuthGuard],data:{name:'新增'}},
        {path:':id',component:GroupEditComponent,canActivate:[AuthGuard],data:{name:'编辑'}}
      ] },
      { path: 'corporation' ,component: CorporationComponent,canActivate:[AuthGuard],data:{name:'公司设置'},children:[
        {path:'list',component:CorporationListComponent,canActivate:[AuthGuard],data:{name:'列表'}},
        {path:'add',component:CorporationAddComponent,canActivate:[AuthGuard],data:{name:'新增'}},
        {path:':id',component:CorporationEditComponent,canActivate:[AuthGuard],data:{name:'编辑'}}
      ] },
      { path: 'worker', component: WorkerComponent,canActivate:[AuthGuard],data:{name:'工程师设置'} }
    ]},
    {path:'operations',canActivate:[AuthGuard],data:{name:'工作管理'},children:[
      { path: 'op', component: OperationsComponent,canActivate:[AuthGuard],data:{name:'工单'},children:[
        {path:'list',component:OperationListComponent,canActivate:[AuthGuard],data:{name:'列表'}},
        {path:'add',component:OperationAddComponent,canActivate:[AuthGuard],data:{name:'新增'}},
        {path:'add/:orderid',component:OperationAddComponent,canActivate:[AuthGuard],data:{name:'新增'}},
        {path:':id',component:OperationEditComponent,canActivate:[AuthGuard],data:{name:'编辑'}}
      ] },
      { path: 'order', component: OrderComponent,canActivate:[AuthGuard],data:{name:'客户需求'},children:[
        {path:'list',component:OrderListComponent,canActivate:[AuthGuard],data:{name:'列表'}},
        {path:'add',component:OrderAddComponent,canActivate:[AuthGuard],data:{name:'新增'}},
        {path:':id',component:OrderEditComponent,canActivate:[AuthGuard],data:{name:'编辑'}}
      ] },
      { path: 'business', component: BusinessContentComponent,canActivate:[AuthGuard],data:{name:'业务内容设置'},children:[
        {path:'list',component:BusinessContentListComponent,canActivate:[AuthGuard],data:{name:'列表'}},
        {path:'add',component:BusinessContentAddComponent,canActivate:[AuthGuard],data:{name:'新增'}},
        {path:':id',component:BusinessContentEditComponent,canActivate:[AuthGuard],data:{name:'编辑'}}
      ] }
    ]},
    {path:'auth',component:AuthComponent,canActivate:[AuthGuard],data:{name:'用户权限管理'},children:[
      { path: 'user', component: UserComponent,canActivate:[AuthGuard],data:{name:'用户管理'},children:[
        {path:'list',component:UserListComponent,canActivate:[AuthGuard],data:{name:'列表'}},
        {path:'add',component:UserAddComponent,canActivate:[AuthGuard],data:{name:'新增'}},
        {path:':id',component:UserEditComponent,canActivate:[AuthGuard],data:{name:'编辑'}}
      ] },
      { path: 'function', component: FunctionComponent,canActivate:[AuthGuard],data:{name:'功能管理'},children:[
        {path:'list',component:FunctionListComponent,canActivate:[AuthGuard],data:{name:'列表'}}
      ] },
      { path: 'role', component: RoleComponent,canActivate:[AuthGuard],data:{name:'角色管理'},children:[
        {path:'list',component:RoleListComponent,canActivate:[AuthGuard],data:{name:'列表'}},
        {path:'add',component:RoleAddComponent,canActivate:[AuthGuard],data:{name:'新增'}},
        {path:':id',component:RoleEditComponent,canActivate:[AuthGuard],data:{name:'编辑'}}
      ] }
    ]}
  ]},
  {path:'**',component:OtherComponent,data:{name:'页面未找到'}}
];

export const appRoutingProvider:any[]=[];

export const panelbarRouting:ModuleWithProviders=RouterModule.forRoot(PanelbarRoutes);



@NgModule({
  imports:[RouterModule.forRoot(PanelbarRoutes)],
  exports:[RouterModule]
})

export class AppRoutingModule{}

