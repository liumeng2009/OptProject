import {Component} from '@angular/core';

import {products} from './produce';

@Component({
  selector:'address-list',
  templateUrl:'./address-list.component.html',
  styleUrls:['./address-list.component.scss']
})

export class AddressListComponent{

  constructor(

  ){};

  private gridData: any[] = products;
}
