export class Order {
  constructor(
    public id:string,
    public no:boolean,
    public custom_name:string,
    public custom_phone: number,
    public incoming_time: number,
    public custom_position:string,
    public business_description:string,
    public remark:string
  ) {  }
}
