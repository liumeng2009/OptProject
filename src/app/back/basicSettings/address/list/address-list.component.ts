import {Component} from '@angular/core';

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

const products = [{
  "ProductID": 1,
  "ProductName": "Chai",
  "UnitPrice": 18.0000,
  "Discontinued": true
}, {
  "ProductID": 2,
  "ProductName": "Chang",
  "UnitPrice": 19.0000,
  "Discontinued": false
}
];
