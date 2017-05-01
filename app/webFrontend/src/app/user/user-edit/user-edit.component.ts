import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {UserDataService} from '../../shared/data.service';
import {User} from '../../models/user';
import {UserService} from '../../shared/user.service';
import {ActivatedRoute} from '@angular/router';
import {ShowProgressService} from '../../shared/show-progress.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  id: string;
  @Input() user: User;
  userForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private userDataService: UserDataService,
              private showProgress: ShowProgressService,
              private formBuilder: FormBuilder) {
    this.generateForm();
    this.getUserData();
  }

  ngOnInit() {
  }

  getUserData() {
    this.id = this.userService.getCurrentUserId();
    this.userDataService.readSingleItem(this.id).then(
      (val: any) => {
        this.user = val;
        this.userForm.patchValue({
          profile: {
            firstName: this.user.profile.firstName,
            lastName: this.user.profile.lastName
          },
          username: this.user.username,
          email: this.user.email,
          password: this.user.password
        });
      },
      (error) => {
        console.log(error);
      });
  }

  onSubmit() {
    this.user = this.prepareSaveUser();
    this.updateUser();
  }

  prepareSaveUser(): User {
    const userFormModel = this.userForm.value;

    let saveUser: User = new User();
    for(let key in userFormModel) {
      if(userFormModel.hasOwnProperty(key)) {
        saveUser[key] = userFormModel[key];
      }
    }

    for(let key in this.user) {
      if(typeof saveUser[key] === 'undefined') {
        saveUser[key] = this.user[key];
      }
    }

    return saveUser;
  }

  updateUser() {
    this.showProgress.toggleLoadingGlobal(true);
    this.userDataService.updateItem(this.user).then(
      (val) => {
        console.log(val);
        this.showProgress.toggleLoadingGlobal(false);
      },
      (error) => {
        this.showProgress.toggleLoadingGlobal(false);
        console.log(error);
      });
  }

  generateForm() {
    this.userForm = this.formBuilder.group({
      profile: this.formBuilder.group({
        firstName : ['', Validators.required],
        lastName : ['', Validators.required],
      }),
      username: [''],
      email: ['', Validators.required],
      password: ['']
    });
  }
}
