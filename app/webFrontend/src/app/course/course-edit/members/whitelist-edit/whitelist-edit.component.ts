import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {IWhitelistUser} from '../../../../../../../../shared/models/IWhitelistUser';
import {WhitelistUserService} from '../../../../shared/services/data.service';
import {MatSnackBar} from '@angular/material';
import {ICourse} from '../../../../../../../../shared/models/ICourse';
import {DragulaService} from 'ng2-dragula';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-whitelist-edit',
  templateUrl: './whitelist-edit.component.html',
  styleUrls: ['./whitelist-edit.component.scss']
})
export class WhitelistEditComponent implements OnInit {

  dragableWhitelistUser: IWhitelistUser[] = [];
  dragableWhitelistUserInCourse: IWhitelistUser[] = [];
  finishRestCall = false;
  @Input() course: ICourse;
  @Input() dragulaBagId;
  @Input() total = 0;
  @Output() onDragableWhitelistUserInCourse = new EventEmitter<IWhitelistUser[]>();
  @Output() onDragendRemoveWhitelist = new EventEmitter<IWhitelistUser>();
  @Output() onDragendPushWhitelist = new EventEmitter<IWhitelistUser>();
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
              private snackBar: MatSnackBar,
              private dragula: DragulaService) {
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

  createNewWhitelistUser() {
    if (this.whitelistUser.firstName === '') {
      this.snackBar.open('First name should not be empty.', '', {duration: 6000});
      return null;
    } else if (this.whitelistUser.lastName === '') {
      this.snackBar.open('Last name should not be empty.', '', {duration: 6000});
      return null;
    } else if (this.whitelistUser.uid === '' || isNaN(Number(this.whitelistUser.uid))) {
      this.snackBar.open('Unique identification should be a number and not empty', '', {duration: 6000});
      return null;
    }
    this.whitelistUser.courseId = this.course._id;
    return this.whitelistUserService.createItem(this.whitelistUser).then((newUser) => {
      this.dragableWhitelistUser.push(newUser);
      this.onDragendPushWhitelist.emit(newUser);
    });
  }
}
