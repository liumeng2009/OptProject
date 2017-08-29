export class Operation {
  constructor(
    public op:string,
    public checked:boolean,
    public name:string,
    public weight: number,
    public remark:string,
    public id:string
  ) {  }
}
