import { BrowserModule } from '@angular/platform-browser';
import { NgModule,LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule,ReactiveFormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';

import {CookieService} from 'angular2-cookie/services/cookies.service'
//kendo ui 组件
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { GridModule,PDFModule,ExcelModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule,DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { PopupModule }  from '@progress/kendo-angular-popup';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { IntlModule } from '@progress/kendo-angular-intl';
import { LabelModule } from '@progress/kendo-angular-label';
import { ChartsModule } from '@progress/kendo-angular-charts';
//验证组件
import{CustomFormsModule} from 'ng2-validation';
//toast组件
import {ToastModule} from 'ng2-toastr/ng2-toastr';

//登录组件
import {LoginComponent} from './back/login/login.component';
//登录组件
import {RegComponent} from './back/register/reg.component';
//基本设置组件
import {BasicSettingsComponent} from './back/basicSettings/baseSettings.component';
//建筑物相关组件
import {AddressComponent} from './back/basicSettings/address/address.component';
import {AddressListComponent} from './back/basicSettings/address/list/address-list.component';
import {AddressAddComponent} from './back/basicSettings/address/add/address-add.component';
import {AddressEditComponent} from './back/basicSettings/address/edit/address-edit.component';
import {AddressService} from './back/basicSettings/address/address.service';
//组织相关组件
import {GroupComponent} from './back/basicSettings/group/group.component';
import {GroupListComponent} from './back/basicSettings/group/list/group-list.component';
import {GroupAddComponent} from './back/basicSettings/group/add/group-add.component';
import {GroupEditComponent} from './back/basicSettings/group/edit/group-edit.component';
import {GroupService} from './back/basicSettings/group/group.service';
//公司相关组件
import {CorporationComponent} from "./back/basicSettings/corporation/corporation.component";
import {CorporationListComponent} from "./back/basicSettings/corporation/list/corporation-list.component";
import {CorporationAddComponent} from "./back/basicSettings/corporation/add/corporation-add.component";
import {CorporationEditComponent} from "./back/basicSettings/corporation/edit/corporation-edit.component";
import {CorporationService} from './back/basicSettings/corporation/corporation.service';
import {CorpBuildingService} from './back/basicSettings/corporation/corpBuilding.service';
//权限设置组件

//工单组件
import {OperationsComponent} from './back/operations/operations.component';
import {OperationListComponent} from './back/operations/list/operation_list.component';
import {OperationEditComponent} from './back/operations/edit/operation_edit.component';
import {OperationService} from './back/operations/operations.service';
//权限组件
import {AuthComponent} from './back/auth/auth.component';

//用户组件
import {UserComponent} from './back/auth/user/user.component';
import {UserListComponent} from './back/auth/user/list/user-list.component';
import {UserAddComponent} from './back/auth/user/add/user-add.component';
import {UserEditComponent} from "./back/auth/user/edit/user-edit.component";
import {UserService} from './back/auth/user/user.service';

import {WorkerComponent} from './back/basicSettings/worker/worker.component';
import {WorkerService} from './back/basicSettings/worker/worker.service';

import {BusinessContentComponent} from './back/operations/businessContents/businessContent.component';
import {BusinessContentService} from './back/operations/businessContents/businessContent.service';
import {BusinessContentListComponent} from './back/operations/businessContents/list/business-content-list.component';
import {BusinessContentAddComponent} from './back/operations/businessContents/add/business-content-add.component';
import {BusinessContentEditComponent} from './back/operations/businessContents/edit/business-content-edit.component';

import {OrderComponent} from './back/operations/order/order.component';
import {OrderListComponent} from './back/operations/order/list/order-list.component';
import {OrderAddComponent} from './back/operations/order/add/order-add.component';
import {OrderEditComponent} from './back/operations/order/edit/order-edit.component';
import {OrderService} from './back/operations/order/order.service';


//信息综述
import {TotalComponent} from './back/total/total.component';

import {OtherComponent} from './back/components/other.component';

import {panelbarRouting,appRoutingProvider} from './back/app-routing.module';

import {LoginService} from './back/login/login.service'
import {RegService} from './back/register/reg.service'
import {MainService} from './back/main/main.service'
import {MainComponent} from "./back/main/main.component";
import {MissionService} from "./back/main/mission.service";
import {ApiResultService} from './back/main/apiResult.service';
import {AjaxExceptionService} from './back/main/ajaxExceptionService';
import {SwitchService} from "./back/main/switchService";


import {MainPipe} from './back/main/main.pipe';
import {TimeShowPipe} from './back/components/pipes/timeShow.pipe';

import { LmTimePicker }   from './back/components/lmtimepicker/lm-timepicker.component';
import { MouseWheel } from './back/components/lmtimepicker/lm-timepicker.directive';

// Load all required data for the bg locale
import '@progress/kendo-angular-intl/locales/zh/all';

// Load the required calendar data for the de locale
import '@progress/kendo-angular-intl/locales/zh/calendar';


@NgModule({
  declarations: [
    AppComponent,

    LoginComponent,

    RegComponent,

    MainComponent,

    BasicSettingsComponent,

    WorkerComponent,

    AddressComponent,
    AddressListComponent,
    AddressAddComponent,
    AddressEditComponent,

    GroupComponent,
    GroupListComponent,
    GroupAddComponent,
    GroupEditComponent,

    CorporationComponent,
    CorporationListComponent,
    CorporationAddComponent,
    CorporationEditComponent,

    OperationsComponent,
    OperationListComponent,
    OperationEditComponent,

    AuthComponent,

    UserComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent,

    BusinessContentComponent,
    BusinessContentListComponent,
    BusinessContentAddComponent,
    BusinessContentEditComponent,

    OrderComponent,
    OrderListComponent,
    OrderAddComponent,
    OrderEditComponent,

    TotalComponent,

    OtherComponent,

    MainPipe,
    TimeShowPipe,


    LmTimePicker,
    MouseWheel
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,


    BrowserAnimationsModule,
    IntlModule,
    ButtonsModule,
    LayoutModule,
    GridModule,
    PDFModule,
    ExcelModule,
    InputsModule,
    CustomFormsModule,
    DialogModule,
    DropDownsModule,
    DropDownListModule,
    PopupModule,
    DateInputsModule,
    LabelModule,
    ChartsModule,

    ToastModule.forRoot(),

    panelbarRouting
  ],
  providers: [
    CookieService,

    LoginService,
    RegService,
    MainService,
    AddressService,
    GroupService,
    CorporationService,
    CorpBuildingService,
    UserService,
    WorkerService,
    BusinessContentService,
    OrderService,
    OperationService,

    MissionService,
    ApiResultService,
    AjaxExceptionService,
    SwitchService,

    appRoutingProvider,
    {
      provide:LOCALE_ID,useValue:'zh-CN'
    },
    MouseWheel
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
