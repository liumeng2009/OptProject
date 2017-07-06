import { Component, OnChanges, Input, trigger, state, style, animate, transition } from '@angular/core';

import {AlertData} from '../../../bean/alertData'
@Component({
  selector: 'info',
  templateUrl:'./info.component.html',
  animations: [ // 动画的内容
    trigger('visibility', [
      // state 控制不同的状态下对应的不同的样式
      state('shown' , style({ transform: 'translateY(0%)' })),
      state('hidden', style({ transform: 'translateY(-300%)' })),
      // transition 控制状态到状态以什么样的方式来进行转换
      transition('shown => hidden', animate('1000ms')),
      transition('hidden => shown', animate('500ms')),
    ])
  ]
})

export class InfoComponent implements OnChanges{
  visibility = 'hidden'; // 避免ngOnChanges()并降低代码复杂度

  ngOnChanges() {
    //this.visibility = this.isVisible ? 'shown' : 'hidden';
    let type=this.alertData.type;
    console.log(type);
    if(type=='info'){
      this.visibility='shown'
    }
    else{
      this.visibility='hidden'
    }
    setTimeout(()=>{this.visibility='hidden'},2000);
  }

  @Input() alertData: AlertData;
}
