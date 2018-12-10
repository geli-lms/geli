import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {IUnit} from '../../../../../shared/models/units/IUnit';
import * as moment from 'moment';
import {ActivatedRoute, Router} from '@angular/router';
import {IUser} from '../../../../../shared/models/IUser';
import {MessageService} from '../shared/services/message.service';
import {ICourse} from '../../../../../shared/models/ICourse';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit, AfterViewInit {
  @Input() course: ICourse;
  @Input() units: IUnit[];
  unitId: string;
  users: IUser[] = [];
  chatMessageCount: {[unitId: string]: number} = {};

  private getFormattedDeadline(deadline: string) {
    moment.locale(this.translate.currentLang);
    return moment(deadline).format('L LT');
  }

  private getFormattedDate(date: string) {
    moment.locale(this.translate.currentLang);
    return moment(date).format('L');
  }

  constructor(private route: ActivatedRoute,
              private router: Router,
              private msgService: MessageService,
              public translate: TranslateService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.unitId = decodeURIComponent(params['unit']);
    });
    Promise.all(this.units.map(async (unit) => {
      const res = await this.msgService.getMessageCount({room: unit.chatRoom});
      this.chatMessageCount[unit._id] = res.count;
    }));
  }

  ngAfterViewInit(): void {
    try {
      const element = document.getElementById(this.unitId);
      if (element) {
        element.scrollIntoView({behavior: 'smooth'});
      }
    } catch (err) {}
  }

}
