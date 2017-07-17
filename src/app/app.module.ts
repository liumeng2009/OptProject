import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';

import {CookieService} from 'angular2-cookie/services/cookies.service'
//kendo ui 组件
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonsModule} from '@progress/kendo-angular-buttons';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { GridModule,PDFModule,ExcelModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
//验证组件
import{CustomFormsModule} from 'ng2-validation';
//toast组件
import {ToastModule} from 'ng2-toastr/ng2-toastr';

//登录组件
import {LoginComponent} from './back/login/login.component';
//基本设置组件
import {BasicSettingsComponent} from './back/basicSettings/baseSettings.component';
import {WorkerComponent} from './back/basicSettings/worker/worker.component';
//建筑物相关组件
import {AddressComponent} from './back/basicSettings/address/address.component';
import {AddressListComponent} from './back/basicSettings/address/list/address-list.component';
import {AddressAddComponent} from './back/basicSettings/address/add/address-add.component';
import {AddressEditComponent} from './back/basicSettings/address/edit/address-edit.component';
import {AddressService} from './back/basicSettings/address/address.service';

//权限设置组件

//工单组件
import {OperationsComponent} from './back/operations/operations.component';
import {OperationListComponent} from './back/operations/list/operation_list.component';
//信息综述
import {TotalComponent} from './back/total/total.component';


import {DangerComponent} from './back/components/danger/danger.component';
import {SuccessComponent} from './back/components/success/success.component';
import {InfoComponent} from './back/components/info/info.component';

import {panelbarRouting,appRoutingProvider} from './back/app-routing.module';

import {LoginService} from './back/login/login.service'
import {MainService} from './back/main/main.service'
import {MainComponent} from "./back/main/main.component";
import {MissionService} from "./back/main/mission.service";
import {ApiResultService} from './back/main/apiResult.service';
import {AjaxExceptionService} from './back/main/ajaxExceptionService';

import {MainPipe} from './back/main/main.pipe';

@NgModule({
  declarations: [
    AppComponent,

    LoginComponent,

    MainComponent,

    BasicSettingsComponent,
    WorkerComponent,
    AddressComponent,
    AddressListComponent,
    AddressAddComponent,
    AddressEditComponent,

    OperationsComponent,
    OperationListComponent,

    TotalComponent,

    DangerComponent,
    SuccessComponent,
    InfoComponent,

    MainPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,

    BrowserAnimationsModule,
    ButtonsModule,
    LayoutModule,
    GridModule,
    PDFModule,
    ExcelModule,
    InputsModule,
    CustomFormsModule,

    ToastModule.forRoot(),

    panelbarRouting,
  ],
  providers: [
    CookieService,

    LoginService,
    MainService,
    AddressService,
    MissionService,
    ApiResultService,
    AjaxExceptionService,

    appRoutingProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
