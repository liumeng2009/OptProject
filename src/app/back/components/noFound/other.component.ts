import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector:'nofound',
  templateUrl:'./other.component.html',
  styleUrls:['./other.component.scss']
})

export class OtherComponent implements OnInit{

  constructor(
    private title:Title,
    private lo:Location
  ){

  };
  ngOnInit(){
    this.title.setTitle('页面未找到');
  }
  private goBack(){
    this.lo.back();
  }
}
