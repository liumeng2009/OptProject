import { Component,OnInit } from '@angular/core';

@Component({
  selector:'total-area',
  templateUrl:'./total.component.html',
  styleUrls:['./total.component.scss']
})

export class TotalComponent implements OnInit{

  private height={height:'0px'};

  constructor(
    private operationService:OperationService,
    private router:Router,
    private route:ActivatedRoute,
    private apiResultService:ApiResultService,
    private ajaxExceptionService:AjaxExceptionService,
    private dialogService:DialogService,
    private corporationService:CorporationService,
    private switchService:SwitchService
  ){};

  ngOnInit(){
    this.height.height = (window.document.body.clientHeight - 70 - 56 - 50 - 20-27)+'px';
  }
}
