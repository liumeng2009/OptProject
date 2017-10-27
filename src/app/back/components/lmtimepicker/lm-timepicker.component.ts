import { Component,Input, Output,EventEmitter,OnChanges,SimpleChanges,ElementRef,ViewChild,Directive,HostListener } from '@angular/core';
import {LmTime} from "./lmtime";

@Component({
  selector: 'lmtimepicker',
  templateUrl: './lm-timepicker.html',
  styleUrls:['./lm-timepicker.scss']
})

export class LmTimePicker implements OnChanges{
  @Input('timeNow') timeNow: LmTime;
  @Output() change: EventEmitter<LmTime> = new EventEmitter<LmTime>();
  private txtValue='';
  constructor() {
    for(let i=0;i<24;i++){
      this.hours.push(i);
    }
    for(let i=0;i<60;i++){
      this.minutes.push(i);
    }
    for(let i=0;i<60;i++){
      this.seconds.push(i);
    }




  }

  private hourTop;
  private minuteTop;
  private secondTop;

  ngOnChanges(changes:SimpleChanges){
    console.log(changes['timeNow']);
    let vm=changes['timeNow'].currentValue;
    this.txtValue=vm.hour+'时'+vm.minute+'分'+vm.second+'秒';
    if(this.timeNow.hour>-1&&this.timeNow.hour<24){
      this.selectedHour=this.timeNow.hour;
      this.hourTop={'top':((3-this.selectedHour)*30).toString()+'px'};
    }

    if(this.timeNow.minute>-1&&this.timeNow.minute<60){
      this.selectedMinute=this.timeNow.minute;
      this.minuteTop={'top':((3-this.selectedMinute)*30).toString()+'px'};
    }

    if(this.timeNow.second>-1&&this.timeNow.second<60){
      this.selectedSecond=this.timeNow.second;
      this.secondTop={'top':((3-this.selectedSecond)*30).toString()+'px'};
    }

  }

  private show: boolean = true;
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

  private hours:number[]=[];
  private minutes:number[]=[];
  private seconds:number[]=[];

  private selectedHour:number=0;
  private selectedMinute:number=0;
  private selectedSecond:number=0;

  private onHourChange($event){
    console.log($event);
  }


}
