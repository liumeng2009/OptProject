import { Component, OnChanges, Input, trigger, state, style, animate, transition } from '@angular/core';
@Component({
  selector: 'danger',
  templateUrl:'./danger.component.html',
  animations: [ // 动画的内容
    trigger('visibilityChanged', [
      // state 控制不同的状态下对应的不同的样式
      state('shown' , style({ opacity: 1, transform: 'scale(1.0)' })),
      state('hidden', style({ opacity: 0, transform: 'scale(0.0)' })),
      // transition 控制状态到状态以什么样的方式来进行转换
      transition('shown => hidden', animate('600ms')),
      transition('hidden => shown', animate('300ms')),
    ])
  ]
})

export class DangerComponent implements OnChanges{
  visibility = 'shown'; // 避免ngOnChanges()并降低代码复杂度
  @Input() isVisible : boolean = true;

  ngOnChanges() {
    this.visibility = this.isVisible ? 'shown' : 'hidden';
  }
}
