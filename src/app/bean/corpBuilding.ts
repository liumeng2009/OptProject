import {Corporation} from "./corporation";
import {Building} from "./building";
export class CorpBuilding {
  constructor(
    public id:string,
    public corporationId: string,
    public building: Building,
    public floor: number,
    public position:string,
    public status:number,
    public union:string
  ) {  }
}
