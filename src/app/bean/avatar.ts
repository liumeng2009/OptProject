export class Avatar {
  constructor(
    public path: string,
    //1说明是用户自己上传的
    //2说明是用户使用的系统内置头像
    public type: number
  ) {  }
}
