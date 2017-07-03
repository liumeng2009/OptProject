import {NgModule} from '@angular/core';
import {ModuleWithProviders} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';

import {MainComponent} from './main/main.component';

import {BasicSettingsComponent} from './basicSettings/baseSettings.component';
import {AddressComponent} from './basicSettings/address/address.component';
import {WorkerComponent} from './basicSettings/worker/worker.component';

export const PanelbarRoutes:Routes=[
  {path:'',redirectTo:'/admin',pathMatch:'full',data:{name:'首页1',show:false}},
  {path:'login',component:LoginComponent,data:{name:'首页2',show:false}},
  {path:'admin',component:MainComponent,data:{name:'首页3',show:false},children:[
    {path:'basic',component:BasicSettingsComponent,data:{name:'基本设置',show:true},children:[
      { path: 'address', component: AddressComponent,data:{name:'地址设置',show:true} },
      { path: 'worker', component: WorkerComponent,data:{name:'人员设置',show:true} }
    ]}
  ]},



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
