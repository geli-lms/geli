import {Component, Input, OnInit, Output} from '@angular/core';
import {UserDataService} from '../../shared/services/data.service';

@Component({
  selector: 'app-user-role-dropdown',
  templateUrl: './user-role-dropdown.component.html',
  styleUrls: ['./user-role-dropdown.component.scss']
})
export class UserRoleDropdownComponent implements OnInit {

  @Input() additionalOptions: string[];
  @Input() defaultRoleSelection: string;

  availableRoles: string[];
  @Output() selectedRole: string;

  constructor(private userDataService: UserDataService) {
    this.availableRoles = [];
  }

  ngOnInit() {
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
