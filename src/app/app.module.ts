import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonsModule} from '@progress/kendo-angular-buttons';

import {LoginComponent} from './back/login/login.component';

import {AppRoutingModule} from './back/app-routing.module';

@NgModule({
  declarations: [
    AppComponent,

    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    BrowserAnimationsModule,
    ButtonsModule,

    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
