import {Pipe,PipeTransform} from '@angular/core';
import {Location} from '@angular/common';

@Pipe({name:'urlshow'})
export class MainPipe implements PipeTransform{

  constructor(private location:Location){

  }

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
    let url=this.location.path();
    url=url.substring(1,url.length);
    let pathArray=url.split('/');
    let pathNowSecond=pathArray.length>1?pathArray[1]:'';
    let pathNowThird=pathArray.length>2?pathArray[2]:'';
    if(pathNowSecond!=''){
      for(let i=0;i<routerConfig[0].children.length;i++){
        if(routerConfig[0].children[i].path==pathNowSecond){
          routerConfig[0].children[i].data.expanded=true;
        }

        if(pathNowThird!=''&&routerConfig[0].children[i].children){
          //add的情况
          for(let j=0;j<routerConfig[0].children[i].children.length;j++){
            if(routerConfig[0].children[i].children[j].path==pathNowThird){
              routerConfig[0].children[i].children[j].data.selected=true;
            }
          }
        }
      }
    }


    return routerConfig[0].children;
  }
}
