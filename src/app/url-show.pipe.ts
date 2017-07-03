import {Pipe,PipeTransform} from '@angular/core';

@Pipe({name:'urlshow'})
export class UrlShowPipe implements PipeTransform{
  transform(routerConfig:any[]){
    for(let i=0;i<routerConfig.length;i++){
      if(!routerConfig[i].data.show){
        routerConfig.splice(i,1);
      }
    }
    return routerConfig;
  }
}
