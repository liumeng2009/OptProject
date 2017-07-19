import {Pipe,PipeTransform} from '@angular/core';
import {Location} from '@angular/common';


@Pipe({name:'urlshow'})
export class MainPipe implements PipeTransform{

  constructor(private location:Location){

  }

  transform(routerConfig:any[]){
    let url=this.location.path();
    url=url.substring(1,url.length);
    let pathArray=url.split('/');
    let pathNowSecond=pathArray.length>1?pathArray[1]:'';
    let pathNowThird=pathArray.length>2?pathArray[2]:'';

    if(pathNowSecond!=''){
      for(let i=0;i<routerConfig.length;i++){
        if(routerConfig[i].path==pathNowSecond){
          routerConfig[i].data.expanded=true;
        }

        if(pathNowThird!=''&&routerConfig[i].children){
          //add的情况
          for(let j=0;j<routerConfig[i].children.length;j++){
            if(routerConfig[i].children[j].path==pathNowThird){
              routerConfig[i].children[j].data.selected=true;
            }
          }
        }
      }
    }
    return routerConfig;
  }
}
