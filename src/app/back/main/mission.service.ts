import {Injectable,EventEmitter} from '@angular/core';
import {AlertData} from '../../bean/alertData';

@Injectable()
export class MissionService {
  change: EventEmitter<AlertData>;
  remove:EventEmitter<string>;

  constructor(){
    this.change = new EventEmitter();
    this.remove=new EventEmitter();
  }
}
