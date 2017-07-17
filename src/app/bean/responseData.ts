export class ResponseData {
  constructor(
    public status: number,
    public name: string,
    public message:string,
    public data:any,
    public total:number
  ) {  }
}
