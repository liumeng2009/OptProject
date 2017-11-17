import {Pipe,PipeTransform} from '@angular/core';
import {Location} from '@angular/common';


@Pipe({name:'timeshow'})
export class TimeShowPipe implements PipeTransform{

  constructor(private location:Location){

  }

  transform(timestamp:number){
    let date=new Date(timestamp);
    return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
  }
}
