import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector:'other-area',
  template:`
    <h1>404，页面未找到！</h1>
  `
})

export class OtherComponent implements OnInit{

  constructor(
    private title:Title
  ){

  };
  ngOnInit(){
    this.title.setTitle('页面未找到');
  }
}
