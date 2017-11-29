import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-unit-report-details',
  templateUrl: './unit-report-details.component.html',
  styleUrls: ['./unit-report-details.component.scss']
})
export class UnitReportDetailsComponent implements OnInit {

  @Input() unit;

  constructor() { }

  ngOnInit() {
  }

}
