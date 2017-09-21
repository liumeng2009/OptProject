export class CorpBuilding {
  constructor(
    public id:string,
    public corporationId: string,
    public buildingId: string,
    public floor: number,
    public position:string,
    public status:number,
    public buildingName:string,
    public union:string
  ) {  }
}
