import {Injectable,EventEmitter} from '@angular/core';
import {AlertData} from '../../bean/alertData';

@Injectable()
export class MissionService {
  change: EventEmitter<AlertData>;

  constructor(){
    this.change = new EventEmitter();
  }
}
