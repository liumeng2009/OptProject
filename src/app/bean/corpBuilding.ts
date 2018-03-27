import {Corporation} from "./corporation";
import {Building} from "./building";
import {Floor} from "./floor";
import {Position} from "./position";
export class CorpBuilding {
  constructor(
    public id:string,
    public corporationId: string,
    public building: Building,
    public floor: Floor,
    public position:Position,
    public status:number,
    public union:string
  ) {  }
}
