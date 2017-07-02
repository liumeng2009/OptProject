import {NgModule} from '@angular/core';
import {ModuleWithProviders} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';

export const PanelbarRoutes:Routes=[
  {path:'',redirectTo:'/admin',pathMatch:'full',data:{name:'opp'}},
  {path:'login',component:LoginComponent,data:{name:'dsdsd'}},
  {path:'admin',component:MainComponent,data:{name:'rrrrrrrrr'}}
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
