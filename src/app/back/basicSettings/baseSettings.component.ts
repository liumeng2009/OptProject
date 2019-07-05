import { Component } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router'

@Component({
  template: `
    <h1 *ngIf="showInfo">基本信息</h1>
        <router-outlet (activate)='onActivate()'
  (deactivate)='onDeactivate()'></router-outlet>
    `
})

export class BasicSettingsComponent {
  showInfo=true;

  onActivate(){
    this.showInfo=false;
  }
  onDeactivate(){
    this.showInfo=true;
  }
}
