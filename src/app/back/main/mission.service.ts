import {Injectable,EventEmitter} from '@angular/core';
import {AlertData} from '../../bean/alertData';
import {Avatar} from "../../bean/avatar";

@Injectable()
export class MissionService {
  change: EventEmitter<AlertData>;
  remove:EventEmitter<string>;
  showActionDialog:EventEmitter<string>;
  showAddProcess:EventEmitter<string>;
  hasAuth:EventEmitter<string>;
  changeAvatar:EventEmitter<Avatar>

  constructor(){
    this.change = new EventEmitter();
    this.remove=new EventEmitter();
    this.showActionDialog=new EventEmitter();
    this.showAddProcess=new EventEmitter();
    this.hasAuth=new EventEmitter();
    this.changeAvatar=new EventEmitter();
  }
}
