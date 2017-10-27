import {Directive,HostListener,Output,EventEmitter} from '@angular/core';
import {LmTime} from "./lmtime";

@Directive({
  selector: 'div[wheel]'
})
export class MouseWheel {

  @Output() hourChange: EventEmitter<any> = new EventEmitter();

  @HostListener('wheel',['$event'])
  onMouseWheel(event:any) {
    console.log(event);
    let ul;
    if(event.target.firstElementChild){
      ul=event.target.firstElementChild;
    }
    else{
      ul=event.target.parentElement.parentElement;
    }

    let top=ul.style.top;

    let topNumber=0;
    if(top&&top.indexOf('px')>-1){
      topNumber=parseFloat(top.replace('px',''));
    }
    else{
      topNumber=0;
    }

    let length=ul.children.length;

    if(event.deltaY>0){
      if(topNumber>(0-(length-4)*30)){
        ul.style.top=(topNumber-30).toString()+'px';
        let selectedNum=0-(((topNumber-30)/30)-3);
        for(let ch of ul.children){
          ch.firstElementChild.setAttribute('class','')
        }
        ul.children[selectedNum].firstElementChild.setAttribute('class','selected');
        this.hourChange.emit(selectedNum);
      }

    }
    if(event.deltaY<0){
      if(topNumber<90){
        ul.style.top=(topNumber+30).toString()+'px';
        let selectedNum=0-(((topNumber+30)/30)-3);
        for(let ch of ul.children){
          ch.firstElementChild.setAttribute('class','')
        }
        ul.children[selectedNum].firstElementChild.setAttribute('class','selected');
      }

    }
    console.log(event.deltaY);
  }
}
