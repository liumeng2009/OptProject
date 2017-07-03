import {Pipe,PipeTransform} from '@angular/core';

@Pipe({name:'urlshow'})
export class MainPipe implements PipeTransform{
  transform(routerConfig:any[]){
    for(let i=0;i<routerConfig.length;i++){
      if(!routerConfig[i].children){
        routerConfig.splice(i,1);
        i--;
      }
    }
    //只剩下一个主节点，将主节点删除
    //for(let i=0;i<routerConfig[0].children.length;i++){
    //  routerConfig[0].children[0].path='admin/'+routerConfig[0].children[0].path;
    //}
    return routerConfig[0].children;
  }
}
