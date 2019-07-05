import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {MissionService} from '../../../main/mission.service';

import {UserService} from '../user.service';
import {AlertData} from '../../../../bean/alertData';

import {OptConfig} from '../../../../config/config';

import {ApiResultService} from '../../../main/apiResult.service';
import {AjaxExceptionService} from '../../../main/ajaxExceptionService';
import {User} from '../../../../bean/user';
import {Gender} from '../../../../bean/gender';
import {RoleService} from '../../role/role.service';
import {Role} from '../../../../bean/role';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})

export class UserAddComponent implements OnInit {

  user= new User(null, null, null, true, null, null, true, null, null, null);

  genders= [
    new Gender('男', false),
    new Gender('女', true)
  ]
  roles: Role[] = [];
  isRoleLoading = false;
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
    private apiResultService: ApiResultService,
    private ajaxExceptionService: AjaxExceptionService
  ) {

  };


  ngOnInit() {
    this.initRoles();
  }

   onSubmit() {
    this.userService.create(this.user).then(
      data => {
        const result = this.apiResultService.result(data);
        if (result && result.status === 0) {
          this.router.navigate(['../'], {relativeTo: this.route});
        }
      },
      error => {
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }


  initRoles() {
    this.roles.splice(0, this.roles.length);
    this.isRoleLoading = true;
    this.roleService.getRoleList().then(
      data => {
        const result = this.apiResultService.result(data);
        if (result && result.status === 0) {
          this.roles = result.data;
          if (this.roles.length > 0) {
            this.user.roleId = this.roles[0].id;
          }
        }
      },
      error => {
        this.ajaxExceptionService.simpleOp(error);
      }
    )
  }

  femaleChange($event) {
    console.log($event);
    this.user.gender = false;
  }
  maleChange($event) {
    console.log($event);
    this.user.gender = true;
  }
}
