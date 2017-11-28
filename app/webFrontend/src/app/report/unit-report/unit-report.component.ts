import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ReportService} from '../../shared/services/data/report.service';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../models/User';
import {UnitService} from '../../shared/services/data.service';
import {IUnit} from '../../../../../../shared/models/units/IUnit';

@Component({
  selector: 'app-unit-report',
  templateUrl: './unit-report.component.html',
  styleUrls: ['./unit-report.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnitReportComponent implements OnInit {

  private unitId: string;
  private courseId: string;

  public unit: IUnit;
  public userUnitProgress: User[];

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private unitService: UnitService,
    private userService: UserService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.unitId = decodeURIComponent(params['id']);
    });
    this.route.parent.params.subscribe(params => {
      this.courseId = decodeURIComponent(params['id']);
    });
    this.getUnit();
    this.getReport();
  }

  private getUnit() {
    this.unitService.readSingleItem(this.unitId)
      .then((unit: any) => {
        this.unit = unit;
      })
      .catch((err) => {});
  }

  private getReport() {
    this.reportService.getUnitDetailForCourse(this.courseId, this.unitId)
      .then((userUnitProgress) => {
        this.userUnitProgress = userUnitProgress.map((userProgress) => new User(userProgress));
      })
      .catch((err) => {
      });
  }

}
