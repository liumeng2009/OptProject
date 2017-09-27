import {Equipment} from "./equipment";
import {EquipType} from "./equipType";
import {EquipOp} from "./equipOp";
export class Need {
  constructor(
    public equipment:Equipment,
    public type:EquipType,
    public op: EquipOp,
    public no: number
  ) {  }
}
