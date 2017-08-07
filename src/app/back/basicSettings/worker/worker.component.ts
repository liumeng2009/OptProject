import {Component,OnInit} from '@angular/core';

import {User} from '../../../bean/user'

@Component({
  selector:'worker',
  templateUrl:'./worker.component.html',
  styleUrls:['./worker.component.scss']
})

export class WorkerComponent implements OnInit{

  private users:User[]=[];
  private height=0;

  constructor(

  ){};

  ngOnInit(){

    this.height=(window.document.body.clientHeight-70-56-50-20-40);

    let user:User={
      username:'liumeng',
      password:'',
      gender:true,
      email:'3232323',
      phone:''
    }
    this.users.push(user);
    let user1:User={
      username:'liumeng',
      password:'',
      gender:true,
      email:'3232323',
      phone:''
    }
    this.users.push(user1);
    let user2:User={
      username:'liumeng',
      password:'',
      gender:true,
      email:'3232323',
      phone:''
    }
    this.users.push(user2);
  }

  private baseImageUrl: string = "./assets/image/";

  private imageUrl(imageName: string) :string {
    return this.baseImageUrl + imageName + ".jpg";
  }

}
