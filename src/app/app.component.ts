import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private router:Router;
  private selectedId:string='';

  constructor(router:Router){
    this.router=router;
  }

  public stateChange(data:Array<PanelBarItemModel>):boolean{
    let focusedEvent: PanelBarItemModel = data.filter(item => item.focused === true)[0];

    if (focusedEvent.id !== "info") {
      this.selectedId = focusedEvent.id;
      this.router.navigate(["/" + focusedEvent.id]);
    }

    return false;
  }
}
