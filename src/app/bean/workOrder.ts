import {Corporation} from "./corporation";
import {CorpBuilding} from "./corpBuilding";
import {EquipType} from "./equipType";
import {Equipment} from "./equipment";
import {LmTime} from "../back/components/lmtimepicker/lmtime";
import {Order} from "./order";
import {BusinessContent} from "./businessContent";
import {EquipOp} from "./equipOp";

//工单模型
export class WorkOrder {
  constructor(
    public id:string,

    public no:string,

    public custom_name:string,

    public custom_phone: string,

    //建立时间
    public incoming_date_timestamp:number,

    public incoming_date:Date,

    public incoming_date_time:LmTime,

    public custom_position:CorpBuilding,

    public corporation:Corporation,

    public important:boolean,

    //响应时间
    public arrive_date_timestamp:number,

    public arrive_date:Date,

    public arrive_date_time:LmTime,

    //完成时间
    public finish_date_timestamp:number,

    public finish_date:Date,

    public finish_date_time:LmTime,

    public worker:string,

    public type:EquipType,

    public equipment:Equipment,

    public op:EquipOp,

    public checked:boolean,

    public showArriveDate:boolean,

    public showFinishDate:boolean,

    public showWorker:boolean,

    public remark:string,

    //指派工程师时间
    public call_date_timestamp:number,

    public call_date:Date,

    public call_date_time:LmTime,

    public order:Order,

    public businessContent:BusinessContent,

    public isCompleteOperation:boolean,

    public complete: string,

  ) {  }
}
