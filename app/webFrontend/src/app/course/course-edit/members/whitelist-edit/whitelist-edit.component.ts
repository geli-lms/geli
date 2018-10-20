import {Component, Input, Output, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {IWhitelistUser} from '../../../../../../../../shared/models/IWhitelistUser';
import {WhitelistUserService} from '../../../../shared/services/data.service';
import {MatSnackBar} from '@angular/material';
import {ICourse} from '../../../../../../../../shared/models/ICourse';
import {DragulaService} from 'ng2-dragula';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';


import {WhitelistShowComponent} from '../whitelist-show/whitelist-show.component';

@Component({
  selector: 'app-whitelist-edit',
  templateUrl: './whitelist-edit.component.html',
  styleUrls: ['./whitelist-edit.component.scss']
})
export class WhitelistEditComponent implements OnInit {
  static readonly  snackBarDuration = 6000;

  @ViewChild(WhitelistShowComponent)
  showComponent: WhitelistShowComponent;
  @Input() course: ICourse;
  @Input() total = 0;
  @Output() onDragendPushWhitelist = new EventEmitter<IWhitelistUser>();
  @Output() onDragendRemoveWhitelist = new EventEmitter<IWhitelistUser>();
  whitelistUser: any = {firstName: '', lastName: '', uid: '', courseId: null};

  firstNameControl: FormControl = new FormControl();
  lastNameControl: FormControl = new FormControl();
  uidControl: FormControl = new FormControl();

  firstNameOptions;
  lastNameOptions;
  uidOptions;

  filteredOptionsFirstName: Observable<string[]>;
  filteredOptionsLastName: Observable<string[]>;
  filteredOptionsUid: Observable<string[]>;

  constructor(private whitelistUserService: WhitelistUserService,
              private snackBar: MatSnackBar) {
  }

  filter(val: string, options: string[]): string[] {
    return options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  ngOnInit() {
    this.firstNameOptions = this.course.students.map(stud => stud.profile.firstName);
    this.lastNameOptions = this.course.students.map(stud => stud.profile.lastName);
    this.uidOptions = this.course.students.map(stud => stud.uid);
    this.filteredOptionsFirstName = this.firstNameControl.valueChanges
      .startWith(null)
      .map(val => val ? this.filter(val, this.firstNameOptions) : this.firstNameOptions.slice());
    this.filteredOptionsLastName = this.lastNameControl.valueChanges
      .startWith(null)
      .map(val => val ? this.filter(val, this.lastNameOptions) : this.lastNameOptions.slice());
    this.filteredOptionsUid = this.uidControl.valueChanges
      .startWith(null)
      .map(val => val ? this.filter(val, this.uidOptions) : this.uidOptions.slice());
  }

  async createNewWhitelistUser() {
    if (this.whitelistUser.firstName === '') {
      this.snackBar.open('First name should not be empty.', 'Dismiss', {duration: WhitelistEditComponent.snackBarDuration});
      return null;
    } else if (this.whitelistUser.lastName === '') {
      this.snackBar.open('Last name should not be empty.', 'Dismiss', {duration: WhitelistEditComponent.snackBarDuration});
      return null;
    } else if (this.whitelistUser.uid === '' || isNaN(Number(this.whitelistUser.uid))) {
      this.snackBar.open('Unique identification should be a number and not empty',
        'Dismiss', {duration: WhitelistEditComponent.snackBarDuration});
      return null;
    }
    this.whitelistUser.courseId = this.course._id;
    try {
      const newUser: IWhitelistUser = await this.whitelistUserService.createItem(this.whitelistUser);
      this.course.whitelist.push(newUser);
      this.onDragendPushWhitelist.emit(newUser);
      if (this.showComponent.isInCourse(newUser)) {
        this.snackBar.open('Create whitelist user. User is in course.', 'Dismiss', {duration: WhitelistEditComponent.snackBarDuration});
      } else if (this.showComponent.isSignedIn(newUser)) {
        this.snackBar.open('Create whitelist user. User is signed in.', 'Dismiss', {duration: WhitelistEditComponent.snackBarDuration});
      } else {
        this.snackBar.open('Create whitelist user. User is not signed in.', 'Dismiss', {duration: WhitelistEditComponent.snackBarDuration});
      }
      return newUser;
    } catch (exception) {
      this.snackBar.open('Could not create whitelist user. Error was: '
        + exception.error.message, '', {duration: WhitelistEditComponent.snackBarDuration});
      return null;
    }
  }

  removeWhitelistUserFromCourse(whitelistUser: IWhitelistUser) {
    this.onDragendRemoveWhitelist.emit(whitelistUser);
  }
}
