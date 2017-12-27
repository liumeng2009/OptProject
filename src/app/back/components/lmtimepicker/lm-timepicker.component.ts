import { Component,Input, Output,EventEmitter,OnChanges,SimpleChanges,ElementRef,ViewChild,Directive,HostListener } from '@angular/core';
import {LmTime} from "./lmtime";

@Component({
  selector: 'lmtimepicker',
  templateUrl: './lm-timepicker.html',
  styleUrls:['./lm-timepicker.scss']
})

export class LmTimePicker implements OnChanges{
  @Input('timeNow') timeNow: LmTime;
  @Input('disabled') disabled:boolean;

  @Output() change: EventEmitter<LmTime> = new EventEmitter<LmTime>();
  private txtValueSubmit='';
  private txtValue='';
  private showMask:boolean=false;
  constructor(

  ) {
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

  private hourTop={'top':'0px'};
  private minuteTop={'top':'0px'};
  private secondTop={'top':'0px'};

  ngOnChanges(changes:SimpleChanges){
    console.log(changes);

    if(changes['timeNow']){
      let vm=changes['timeNow'].currentValue;
      //this.txtValueSubmit=this.txtValue=vm.hour+'时'+vm.minute+'分'+vm.second+'秒';
      if(vm){
        this.timeNow.hour=vm.hour;
        this.timeNow.minute=vm.minute;
        this.timeNow.second=vm.second;
        this.makeTextValue(true);
        this.initWheel();
      }
    }
    if(changes['disabled'])
      this.showMask=!changes['disabled'].currentValue;

  }

  private initWheel(){
    if(this.timeNow.hour>-1&&this.timeNow.hour<24){
      this.selectedHour=this.timeNow.hour;
      this.hourTop.top=((3-this.selectedHour)*30).toString()+'px';
    }

    if(this.timeNow.minute>-1&&this.timeNow.minute<60){
      this.selectedMinute=this.timeNow.minute;
      this.minuteTop.top=((3-this.selectedMinute)*30).toString()+'px'
    }

    if(this.timeNow.second>-1&&this.timeNow.second<60){
      this.selectedSecond=this.timeNow.second;
      this.secondTop.top=((3-this.selectedSecond)*30).toString()+'px'
    }
    //console.log(this.hourTop);
    //console.log(this.minuteTop);
    //console.log(this.secondTop);
  }

  private show: boolean = false;
  public onToggle(s): void {
    if(!this.showMask){
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

  @ViewChild('hourWheel') public hourWheel:ElementRef;
  private containsHourWheel(target:any):boolean{
    return this.hourWheel.nativeElement.contains(target);
  }
  @ViewChild('minuteWheel') public minuteWheel:ElementRef;
  private containsMinuteWheel(target:any):boolean{
    return this.minuteWheel.nativeElement.contains(target);
  }
  @ViewChild('secondWheel') public secondWheel:ElementRef;
  private containsSecondWheel(target:any):boolean{
    return this.secondWheel.nativeElement.contains(target);
  }

  @HostListener('wheel',['$event'])
  onHourMouseWheel(event:any) {
    event.preventDefault();

    let timeType='other';

    if(this.containsHourWheel(event.target)){
      //console.log('hour');
      timeType='hour';
    }
    else if(this.containsMinuteWheel(event.target)){
      //console.log('minute');
      timeType='minute';
    }
    else if(this.containsSecondWheel(event.target)){
      //console.log('second');
      timeType='second';
    }
    else{
      //console.log('other');
    }

    if(event.deltaY>0){
      this.caleTimeAreaTop(timeType,'reduce')
    }
    if(event.deltaY<0){
      this.caleTimeAreaTop(timeType,'add')
    }

  }

  private caleTimeAreaTop(timeType,action){
    switch (timeType){
      case 'hour':
        let hourtop= parseFloat(this.hourTop.top.replace('px',''));
        if(action=='add'){
          if(hourtop<90){
            this.timeNow.hour=this.selectedHour=this.selectedHour-1;
            this.hourTop.top=(hourtop+30)+'px';
          }
        }
        else{
          if(hourtop>(4-24)*30){
            this.timeNow.hour=this.selectedHour=this.selectedHour+1;
            this.hourTop.top=(hourtop-30)+'px';
          }
        }
        break;
      case 'minute':
        let minutetop= parseFloat(this.minuteTop.top.replace('px',''));
        if(action=='add'){
          if(minutetop<90){
            this.timeNow.minute=this.selectedMinute=this.selectedMinute-1;
            this.minuteTop.top=(minutetop+30)+'px';
          }
        }
        else{
          if(minutetop>(4-60)*30){
            this.timeNow.minute=this.selectedMinute=this.selectedMinute+1;
            this.minuteTop.top=(minutetop-30)+'px';
          }
        }
        break;
      case 'second':
        let secondtop= parseFloat(this.secondTop.top.replace('px',''));
        if(action=='add'){
          if(secondtop<90){
            this.timeNow.second=this.selectedSecond=this.selectedSecond-1;
            this.secondTop.top=(secondtop+30)+'px';
          }
        }
        else{
          if(secondtop>(4-60)*30){
            this.timeNow.second=this.selectedSecond=this.selectedSecond+1;
            this.secondTop.top=(secondtop-30)+'px';
          }
        }
        break;
      default:
        break;

    }
    this.makeTextValue(false);
  }

  private hours:number[]=[];
  private minutes:number[]=[];
  private seconds:number[]=[];

  private selectedHour:number=0;
  private selectedMinute:number=0;
  private selectedSecond:number=0;

  /*issubmit 是否更新textbox */
  private makeTextValue(isSubmit){
    this.txtValue=(this.timeNow.hour<10?('0'+this.timeNow.hour+'时'):(this.timeNow.hour+'时'))+
      (this.timeNow.minute<10?('0'+this.timeNow.minute+'分'):(this.timeNow.minute+'分'))+
      (this.timeNow.second<10?('0'+this.timeNow.second+'秒'):(this.timeNow.second+'秒'))
    if(isSubmit)
      this.txtValueSubmit=this.txtValue;
  }

  private timeTypeSelected='hour';
  private onTypeChange($event){
    this.timeTypeSelected=$event;
  }

  private clickNow(){
    let date=new Date();
    this.timeNow.hour=date.getHours();
    this.timeNow.minute=date.getMinutes();
    this.timeNow.second=date.getSeconds();
    this.makeTextValue(false);
    this.initWheel();
    this.txtValueSubmit=this.txtValue;
    this.change.emit(this.timeNow);
    this.show=false;
  }

  private spanClick(type,event){
    switch(type){
      case 'hour':
        this.timeNow.hour=this.selectedHour=event;
        break;
      case 'minute':
        this.timeNow.minute=this.selectedMinute=event;
        break;
      case 'second':
        this.timeNow.second=this.selectedSecond=event;
        break;
      default:
        break;
    }
    this.makeTextValue(false);
    this.initTopByTime();
  }

  private initTopByTime(){
    this.hourTop.top=(3-this.selectedHour)*30+'px';
    this.minuteTop.top=(3-this.selectedMinute)*30+'px';
    this.secondTop.top=(3-this.selectedSecond)*30+'px';
  }

  private submitTime(){
    this.txtValueSubmit=this.txtValue;
    this.change.emit(this.timeNow);
    this.show=false;
  }
  private cancelTime(){
    this.show=false;
  }

}
