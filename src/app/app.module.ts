import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import {CookieService} from 'angular2-cookie/services/cookies.service'

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonsModule} from '@progress/kendo-angular-buttons';
import { LayoutModule } from '@progress/kendo-angular-layout';

import {LoginComponent} from './back/login/login.component';
import {MainComponent} from './back/main/main.component';
import {DangerComponent} from './back/components/danger/danger.component';

import {AppRoutingModule} from './back/app-routing.module';

import {LoginService} from './back/login/login.service'
import {MainService} from './back/main/main.service'

@NgModule({
  declarations: [
    AppComponent,

    LoginComponent,
    MainComponent,

    DangerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    BrowserAnimationsModule,
    ButtonsModule,
    LayoutModule,

    AppRoutingModule
  ],
  providers: [
    CookieService,

    LoginService,
    MainService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
