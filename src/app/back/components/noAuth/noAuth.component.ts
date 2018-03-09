import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector:'noauth',
  templateUrl:'./noAuth.component.html',
  styleUrls:['./noAuth.component.scss']
})

export class NoAuthComponent implements OnInit{

  constructor(
    private title:Title,
    private lo:Location
  ){

  };
  ngOnInit(){
    this.title.setTitle('没有权限访问该页面');
  }
  private goBack(){
    this.lo.back();
  }
}
