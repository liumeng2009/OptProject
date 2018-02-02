import {Operation} from './operation';
import {EquipType} from "./equipType";
import {EquipOp} from "./equipOp";

export class BusinessContent {
  constructor(
    public type:string,
    public equipment: string,
    public operations:Operation[],
    public equipType:EquipType,
    public equipOp:EquipOp
  ) {  }
}

export class BusinessContentPage {
  constructor(
    public type:string,
    public equipment: string,
    public operationsDesk:Operation[],
    public operationsSys:Operation[],
    public equipType:EquipType,
    public equipOp:EquipOp
  ) {  }
}
