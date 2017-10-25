import { Component,Input, Output,EventEmitter,OnChanges,SimpleChanges,ElementRef,ViewChild,HostListener } from '@angular/core';
import {LmTime} from "./lmtime";
@Component({
  selector: 'lmtimepicker',
  templateUrl: './lm-timepicker.html'
})

export class LmTimePicker implements OnChanges{
  @Input('timeNow') timeNow: LmTime;
  @Output() change: EventEmitter<LmTime> = new EventEmitter<LmTime>();
  private txtValue='';
  constructor() {

  }

  ngOnChanges(changes:SimpleChanges){
    console.log(changes['timeNow']);
    let vm=changes['timeNow'].currentValue;
    this.txtValue=vm.hour+'时'+vm.minute+'分';
  }

  private show: boolean = false;
  public onToggle(s): void {
    if(s==undefined){
      if(this.show){
        this.show=false;
      }
      else{
        this.show=true;
      }
    }
    else{
      this.show=s;
    }
  }

  @ViewChild('anchor') public anchor: ElementRef;
  @ViewChild('popup', { read: ElementRef }) public popup: ElementRef;
  @ViewChild('maskTxt', { read: ElementRef }) public maskTxt: ElementRef;
  private contains(target: any): boolean {
    return this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target): false)||
      (this.maskTxt ? this.maskTxt.nativeElement.contains(target): false)
      ;
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.onToggle(false);
    }
  }

}
