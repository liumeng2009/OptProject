export class User {
  constructor(
    public id:string,
    public username: string,
    public password: string,
    public gender:Boolean,
    public phone:string,
    public email:string,
    public canLogin:Boolean
  ) {  }
}
