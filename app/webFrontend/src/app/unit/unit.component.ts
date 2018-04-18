import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {IUnit} from '../../../../../shared/models/units/IUnit';
import * as moment from 'moment';
import {ActivatedRoute, Router} from '@angular/router';
import {UserDataService} from '../shared/services/data.service';
import {UserService} from "../shared/services/user.service";
import {IUser} from "../../../../../shared/models/IUser";
import {isLowerCase} from 'tslint/lib/utils';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit, AfterViewInit {

  @Input() units: IUnit[];
  unitId: string;
  users: IUser[] = [];

  private getDeadlineDiffTime (deadline: string) {
    const momentDeadline = moment(deadline);
    if (momentDeadline.isBefore()) {
      return '';
    }

    return ` ${momentDeadline.fromNow(true)}`;
  }

  private getDeadlineDiffText (deadline: string) {
    const momentDeadline = moment(deadline);
    if (momentDeadline.isBefore()) {
      return 'Deadline is over';
    }

    return 'Deadline ends in';
  }

  private getFormattedDeadline(deadline: string) {
    return moment(deadline).format('DD.MM.YYYY HH:mm');
  }

  private selectColorForDeadline(deadline: string) {
    const diffInHours = moment(deadline).diff(moment(), 'hours');
    const diffInDays = moment(deadline).diff(moment(), 'days');
    if (diffInDays <= -7) {
      return '';
    }
    if (diffInHours <= 3) {
      return 'red';
    }
    if (diffInHours <= 24) {
      return 'orange';
    }

    return '';
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userDataService: UserDataService) {
  }

  async getUsers() {
    for(const unit of this.units) {
      if (unit.unitCreator) {
        const user = <IUser> await this.userDataService.readSingleItem(unit.unitCreator);
        this.users.push(user);
      }
    }
  }

  readUser(_id: any): string {
    const localUnit = this.units.find(unit => unit._id == _id);
    if(localUnit.unitCreator) {
      const localUser = this.users.find(user => user._id.toString() == localUnit.unitCreator);
      return localUser.profile.firstName + ' ' +  localUser.profile.lastName;
    } else {
      return '';
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.unitId = decodeURIComponent(params['unit']);
    });
    this.getUsers();
  }

  ngAfterViewInit(): void {
    try {
      const element = document.getElementById(this.unitId);
      if (element) {
        element.scrollIntoView();
      }
    } catch (err) {}
  }

}
