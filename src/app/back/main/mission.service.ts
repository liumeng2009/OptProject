import {Injectable,EventEmitter} from '@angular/core';

@Injectable()
export class MissionService {
  change: EventEmitter<number>;

  constructor(){
    this.change = new EventEmitter();
  }
}
