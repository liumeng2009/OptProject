import {Group} from "./group";
export class Corporation {
  constructor(
    public id:string,
    public name: string,
    public description: string,
    public group: Group,
    public status:number
  ) {  }
}
