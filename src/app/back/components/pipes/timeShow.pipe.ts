import {Pipe,PipeTransform} from '@angular/core';
import {Location} from '@angular/common';


@Pipe({name:'timeshow'})
export class TimeShowPipe implements PipeTransform{

  constructor(private location:Location){

  }

  transform(timestamp:number){
    let date=new Date(timestamp);
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+(date.getMinutes()>9?date.getMinutes().toString():('0'+date.getMinutes().toString()))
      +":"+(date.getSeconds()>9?date.getSeconds().toString():('0'+date.getSeconds().toString()));
  }
}

@Pipe({name:'timeshowsimple'})
export class TimeShowSimplePipe implements PipeTransform{

  constructor(private location:Location){

  }

  transform(timestamp:number){
    let date=new Date(timestamp);
    return date.getHours()+":"+(date.getMinutes()>9?date.getMinutes().toString():('0'+date.getMinutes().toString()))
      +":"+(date.getSeconds()>9?date.getSeconds().toString():('0'+date.getSeconds().toString()));
  }
}
