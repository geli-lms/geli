import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserDataService} from '../../shared/services/data.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSelect} from '@angular/material';

@Component({
  selector: 'app-user-role-dropdown',
  templateUrl: './user-role-dropdown.component.html',
  styleUrls: ['./user-role-dropdown.component.scss']
})
export class UserRoleDropdownComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() controlName: string;
  @Input() additionalOptions: string[];
  @Input() defaultRoleSelection: string;
  @Input() selectedRole: string;

  availableRoles: string[];

  constructor(private userDataService: UserDataService) {
    this.availableRoles = [];
  }

  ngOnInit() {
    if (!this.controlName) {
      this.controlName = 'role';
    }
    this.form.addControl(this.controlName, new FormControl(this.defaultRoleSelection, Validators.required))
    if (this.additionalOptions) {
      this.availableRoles = this.availableRoles.concat(this.additionalOptions);
    }

    if (this.defaultRoleSelection) {
      this.selectedRole = this.defaultRoleSelection;
    }
    this.getRoles();
  }

  getRoles() {
    this.userDataService.getRoles().then(roles => {
      this.availableRoles = this.availableRoles.concat(roles);
    });
  }
}
