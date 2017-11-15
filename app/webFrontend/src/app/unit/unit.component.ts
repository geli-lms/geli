import {Component, OnInit, Input} from '@angular/core';
import {IUnit} from '../../../../../shared/models/units/IUnit';
import * as moment from 'moment';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {

  @Input() units: IUnit[];

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

  constructor() {
  }

  ngOnInit() {
  }

}
