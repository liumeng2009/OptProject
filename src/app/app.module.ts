import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';

import {CookieService} from 'angular2-cookie/services/cookies.service'

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonsModule} from '@progress/kendo-angular-buttons';
import { LayoutModule } from '@progress/kendo-angular-layout';

//登录组件
import {LoginComponent} from './back/login/login.component';
//基本设置组件
import {BasicSettingsComponent} from './back/basicSettings/baseSettings.component';
import {WorkerComponent} from './back/basicSettings/worker/worker.component';
import {AddressComponent} from './back/basicSettings/address/address.component';

//权限设置组件


import {DangerComponent} from './back/components/danger/danger.component';
import {SuccessComponent} from './back/components/success/success.component';
import {InfoComponent} from './back/components/info/info.component';

import {panelbarRouting,appRoutingProvider} from './back/app-routing.module';

import {LoginService} from './back/login/login.service'
import {MainService} from './back/main/main.service'
import {MainComponent} from "./back/main/main.component";

import {MainPipe} from './back/main/main.pipe';

@NgModule({
  declarations: [
    AppComponent,

    LoginComponent,

    MainComponent,

    BasicSettingsComponent,
    WorkerComponent,
    AddressComponent,

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

    panelbarRouting
  ],
  providers: [
    CookieService,

    LoginService,
    MainService,

    appRoutingProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
