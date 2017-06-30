import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import {CookieService} from 'angular2-cookie/services/cookies.service'

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonsModule} from '@progress/kendo-angular-buttons';
import { LayoutModule } from '@progress/kendo-angular-layout';

import {LoginComponent} from './back/login/login.component';
import {MainComponent} from './back/main/main.component';
import {WorkerComponent} from './back/worker/worker.component';


import {DangerComponent} from './back/components/danger/danger.component';
import {SuccessComponent} from './back/components/success/success.component';

import {panelbarRouting,appRoutingProvider} from './back/app-routing.module';

import {LoginService} from './back/login/login.service'
import {MainService} from './back/main/main.service'

@NgModule({
  declarations: [
    AppComponent,

    LoginComponent,
    MainComponent,
    WorkerComponent,

    DangerComponent,
    SuccessComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,

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
