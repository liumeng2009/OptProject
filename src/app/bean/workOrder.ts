import {Corporation} from "./corporation";
import {CorpBuilding} from "./corpBuilding";
import {EquipType} from "./equipType";
import {Equipment} from "./equipment";
export class WorkOrder {
  constructor(
    public id:string,

    public no:string,

    public custom_name:string,

    public custom_phone: string,

    public incoming_date_timestamp:number,

    public custom_position:CorpBuilding,

    public corporation:Corporation,

    public important:boolean,

    public arriveTime:number,

    public finishTime:number,

    public worker:string,

    public type:EquipType,

    public equipment:Equipment,

    public op:EquipType,

    public checked:boolean

  ) {  }
}
