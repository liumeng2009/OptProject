import {NgModule} from '@angular/core';
import {ModuleWithProviders} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';

import {MainComponent} from './main/main.component';

//基本信息设置
import {BasicSettingsComponent} from './basicSettings/baseSettings.component';

import {AddressComponent} from './basicSettings/address/address.component';
import {AddressListComponent} from './basicSettings/address/list/address-list.component';
import {AddressAddComponent} from './basicSettings/address/add/address-add.component';
import {AddressEditComponent} from './basicSettings/address/edit/address-edit.component';



import {WorkerComponent} from './basicSettings/worker/worker.component';
//工单记录
import {OperationsComponent} from './operations/operations.component';
import {OperationListComponent} from './operations/list/operation_list.component';
//信息综述
import {TotalComponent} from './total/total.component';

export const PanelbarRoutes:Routes=[
  {path:'',redirectTo:'/admin/total',pathMatch:'full',data:{name:'首页'}},
  {path:'login',component:LoginComponent,data:{name:'登录'}},
  {path:'admin',component:MainComponent,data:{name:'首页'},children:[
    {path:'total',component:TotalComponent,data:{name:'数据综述'},},
    {path:'basic',component:BasicSettingsComponent,data:{name:'基本设置'},children:[
      { path: 'address' ,component: AddressComponent,data:{name:'地址设置'},children:[
        {path:'list',component:AddressListComponent,data:{name:'列表'}},
        {path:'add',component:AddressAddComponent,data:{name:'新增'}},
        {path:':id',component:AddressEditComponent,data:{name:'编辑'}}
      ] },
      { path: 'worker', component: WorkerComponent,data:{name:'人员设置'} }
    ]},
    {path:'operations',component:OperationsComponent,data:{name:'工单'},children:[
      { path: 'list', component: OperationListComponent,data:{name:'工单列表'} }
    ]},

  ]}
/*  {path:'**',component:OtherComponent,data:{name:'页面未找到'}}*/
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
