import { Component, OnInit } from '@angular/core';
import {ApiResultService} from '../main/apiResult.service';
import {AjaxExceptionService} from '../main/ajaxExceptionService';
import * as moment from 'moment';
import { ToastsManager } from 'ng2-toastr';
import { OptConfig } from 'app/config/config';

@Component({
  selector: 'app-tools-area',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})

export class ToolsComponent implements OnInit {

   height = {height: '0px'};
   start: any = null;
   end: any = null;
  constructor(
    private toastr: ToastsManager,
    private apiResultService: ApiResultService,
    private ajaxExceptionService: AjaxExceptionService
  ) {};

  ngOnInit() {
    this.height.height = (window.document.body.clientHeight - 70 - 56 - 50 - 20 - 27) + 'px';
    this.initStartEndDate();
  }
  initStartEndDate() {
    // 四月一日为周期的起点，初始化为上一年的4.1到本年的3.31
    const year = moment().year();
    const startDate = new Date(year - 1, 3, 1);
    const endDate = new Date(year, 3, 1);
    this.start = startDate;
    this.end = endDate;
  }
  dateStartChange(e) {
    this.start = e;
  }
  dateEndChange(e) {
    this.end = e;
  }

   print() {
    window.open(new OptConfig().serverPath + '/page/yearsheet?start=' + moment(this.start).valueOf()
    + '&end=' + moment(this.end).valueOf());
  }
}
