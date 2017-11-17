import {Directive,HostListener,Output,Input,EventEmitter} from '@angular/core';
import {LmTime} from "./lmtime";

@Directive({
  selector: 'div[wheel]'
})
export class MouseWheel {

  @Input('timeType') timeType: string;
  @Output() typeChange:EventEmitter<any>=new EventEmitter();



  @HostListener('mouseover',['$event'])
  onMouseOver(event:any){
    //console.log('发送事件：'+this.timeType);
    this.typeChange.emit(this.timeType);
  }

}
