export class User {
  constructor(
    public id:string,
    public name: string,
    public password: string,
    public gender:Boolean,
    public phone:string,
    public email:string,
    public canLogin:Boolean
  ) {  }
}
