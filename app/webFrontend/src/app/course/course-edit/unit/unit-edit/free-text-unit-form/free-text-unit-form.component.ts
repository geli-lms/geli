import {Component, Input, OnInit} from '@angular/core';
import {IFreeTextUnit} from '../../../../../../../../../shared/models/units/IFreeTextUnit';
import {MdSnackBar} from '@angular/material';
import {FreeTextService, UnitService} from '../../../../../shared/services/data.service';
import {FreeTextUnit} from '../../../../../models/FreeTextUnit';

@Component({
  selector: 'app-free-text-unit-form',
  templateUrl: './free-text-unit-form.component.html',
  styleUrls: ['./free-text-unit-form.component.scss']
})
export class FreeTextUnitFormComponent implements OnInit {
  @Input() courseId: any;
  @Input() lectureId: string;
  freeTextUnit: IFreeTextUnit;

  constructor(private unitService: UnitService,
              private freeTextService: FreeTextService,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.freeTextUnit = new FreeTextUnit(this.courseId);
    this.loadMarkdownFromServer();
  }

  loadMarkdownFromServer() {
    this.freeTextService.getStuff(this.courseId).then(unit => {
      // FIXME: What do I have to do here?
    });
  }

  addUnit() {
    this.unitService.addFreeTextUnit(this.freeTextUnit, this.lectureId)
      .then(
        (unit) => this.snackBar.open('Free text unit saved', '', {duration: 3000}),
        (error) => console.log(error)
      );
  }
}
