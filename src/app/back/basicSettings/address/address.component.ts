import {Component,OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';


@Component({
  selector:'address',
  templateUrl:'./address.component.html',
  styleUrls:['./address.component.scss']
})

export class AddressComponent implements OnInit{

  constructor(
    private location:Location,
    private router:Router
  ){
  };

  ngOnInit(){
    //let url=this.location.path();
    //url=url.substring(1,url.length);
    //if(url=='admin/basic/address'){
    //  this.router.navigate(['admin/basic/address/list']);
    //}
  }
}
