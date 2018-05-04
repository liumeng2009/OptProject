export class User {
  constructor(
    public id:string,
    public name: string,
    public password: string,
    //true 男 false 女
    public gender:Boolean,
    public phone:string,
    public email:string,
    public canLogin:Boolean,
    public roleId:string,
    public avatar:string,
    public avatarUseImg:number
  ) {  }
}
