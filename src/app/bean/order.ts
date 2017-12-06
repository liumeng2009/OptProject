import {Corporation} from "./corporation";
import {CorpBuilding} from "./corpBuilding";
import {WorkOrder} from "./workOrder";
import {Operation} from "./operation";
export class Order {
  constructor(
    public id:string,
    public no:string,
    public custom_name:string,
    public custom_phone: string,
    public incoming_date:string,
    public incoming_date_timestamp:number,
    public hour:number,
    public minute:number,
    public second:number,
    public custom_position:CorpBuilding,
    public business_description:string,
    public remark:string,
    public group:string,
    public corporation:Corporation,
    public needs:any,
    public workerOrders:WorkOrder[]
  ) {  }
}
