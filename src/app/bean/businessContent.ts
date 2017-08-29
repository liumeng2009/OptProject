import {Operation} from './operation';

export class BusinessContent {
  constructor(
    public type:string,
    public equipment: string,
    public operations:Operation[]
  ) {  }
}
