import {Injectable} from '@angular/core';



@Injectable()
export class SwitchService {

  private CORP_BUILDING_LIST_AUTO_ADD:boolean=false;

  constructor(

  ){

  }

  setCorpBuildingListAutoAdd(bool:boolean){
    this.CORP_BUILDING_LIST_AUTO_ADD=bool;
  }
  getCorpBuildingListAutoAdd(){
    return this.CORP_BUILDING_LIST_AUTO_ADD;
  }
}
