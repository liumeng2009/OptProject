export class EquipType {
  constructor(
    public id:string,
    public name: string,
    public code: string

  ) {  }
  static fromJSON(json: any): EquipType {
    let object = Object.create(EquipType.prototype);
    Object.assign(object, json);
    return object;
  }
}
