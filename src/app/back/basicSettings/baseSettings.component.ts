import { Component } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router'

@Component({
  template: `
    <h1 *ngIf="showInfo">基本信息</h1>
        <router-outlet (activate)='onActivate($event)'
  (deactivate)='onDeactivate($event)'></router-outlet>
    `
})

export class BasicSettingsComponent {
  private showInfo=true;

  private onActivate(){
    this.showInfo=false;
  }
  private onDeactivate(){
    this.showInfo=true;
  }

}
