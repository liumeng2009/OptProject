import {Component,OnInit,ViewContainerRef} from '@angular/core';
import {Location} from '@angular/common';
import {Router,ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector:'noauth',
  templateUrl:'./noAuth.component.html',
  styleUrls:['./noAuth.component.scss']
})

export class NoAuthComponent implements OnInit{

  private second:number=5;
  constructor(
    private title:Title,
    private router:Router,
    private route:ActivatedRoute
  ){

  };
  ngOnInit(){
    this.title.setTitle('没有权限访问该页面');
    this.goSecond();
  }

  private goSecond(){
    setInterval(()=>{
      this.second--;
      if(this.second==0){
        this.router.navigate(['../admin/total'],{relativeTo:this.route});
      }
    },1000);
  }

  private goMain(){
    this.router.navigate(['../admin/total'],{relativeTo:this.route});
  }
}
