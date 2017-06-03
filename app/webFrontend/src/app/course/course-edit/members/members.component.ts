/** Created by Oliver Neff on 14.04.2017. */
import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {CourseService, UserDataService} from '../../../shared/services/data.service';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {User} from '../../../models/User';
import {Course} from '../../../models/Course';
import {DragulaService} from 'ng2-dragula';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss', '../../../../../node_modules/dragula/dist/dragula.css']
})
export class MembersComponent implements OnInit {
  @Input() courseId;
  course: Course;
  members: User[] = [];
  users: User[] = [];
  currentMember: User = null;
  fuzzySearch: String = '';
  userCtrl: FormControl;
  filteredStates: any;

  setMember(member: User) {
    this.currentMember = member;
  }

  constructor(private userService: UserDataService,
              private courseService: CourseService,
              private showProgress: ShowProgressService,
              private  dragula: DragulaService) {

    dragula.setOptions('bag-one', {
      revertOnSpill: true
    });
    dragula.drop.subscribe(value => {
      this.course.students = this.members;
      this.updateMembersInCourse();
    });
    this.getStudents();

    this.userCtrl = new FormControl();
    this.filteredStates = this.userCtrl.valueChanges
      .startWith(null)
      .map(name => this.filterStates(name));
  }

  ngOnInit() {
    this.getCourseMembers();
  }

  ngOnDestroy() {
    this.dragula.destroy('bag-one');
  }

  /**
   * Save all students in this course in database.
   */
  updateMembersInCourse() {
    this.showProgress.toggleLoadingGlobal(true);
    this.courseService.updateItem({'students': this.course.students, '_id': this.courseId}).then(
      (val) => {
        this.showProgress.toggleLoadingGlobal(false);
      }, (error) => {
        this.showProgress.toggleLoadingGlobal(false);
        console.log(error);
      });
  }

  /**
   * Switch a user from student to member and back and update this course in database.
   * @param _id Id of an user.
   * @param direction direction where user to switch.
   */
  switchUser(id: string, direction: string) {
    if (direction === 'right') {
      this.members = this.members.concat(this.users.filter(obj => id === obj._id));
      this.users = this.users.filter(obj => !(id === obj._id));
    } else if (direction === 'left') {
      this.users = this.users.concat(this.members.filter(obj => id === obj._id));
      this.members = this.members.filter(obj => !(id === obj._id));
    }
    this.sortUsers(this.members);
    this.sortUsers(this.users);
    this.course.students = this.members;
    this.updateMembersInCourse();
  }

  /**
   * Get all users from api and filter those role student.
   */
  getStudents() {
    this.userService.readItems().then(users => {
      this.users = users.filter(obj => obj.role === 'student');
    });
    this.sortUsers(this.members);
  }

  /**
   * Get this course from api and filter all members from users.
   */
  getCourseMembers() {
    this.courseService.readSingleItem(this.courseId).then(
      (val: any) => {
        this.course = new Course(val);
        this.members = this.course.students;

        this.members.forEach(member =>
          this.users = this.users.filter(function (user) {
            return user._id !== member._id;
          }));
        this.sortUsers(this.users);
      }, (error) => {
        console.log(error);
      });
  }

  /**
   * Sort an array of users alphabeticaly after firstname and lastname.
   * @param users An array of users.
   */
  sortUsers(users: User[]) {
    users.sort(function (a, b) {
      if (a.profile.firstName < b.profile.firstName || a.profile.lastName < b.profile.lastName) {
        return -1;
      }
      if (a.profile.firstName > b.profile.firstName || a.profile.lastName < b.profile.lastName) {
        return 1;
      }
      return 0;
    });
  }

  filterStates(val: string) {
    return val ? this.users.filter(s => this.fuzzysearch(val, s))
      .map(e => e.profile.firstName + ' ' + e.profile.lastName + ' ' + e.uid + ' ' + e.email)
      : [];
  }

  fuzzysearch(toSearch: string, user: User): boolean {
    const lowerToSearch: string = toSearch.toLowerCase();
    const elementsToFind = lowerToSearch.split(' ');
    const resArray = elementsToFind.filter(e => user.profile.firstName.toLowerCase().includes(e) ||
      user.profile.lastName.toLowerCase().includes(e) ||
      user.uid.toLowerCase().includes(e) ||
      user.email.toLowerCase().includes(e)
    );
    return resArray.length > 0;
  }
}
