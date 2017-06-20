import {Component, Input, OnInit} from '@angular/core';
import {IFreeTextUnit} from '../../../../../../../../../shared/models/units/IFreeTextUnit';
import {MdSnackBar} from '@angular/material';
import {FreeTextService, UnitService} from '../../../../../shared/services/data.service';
import {FreeTextUnit} from '../../../../../models/FreeTextUnit';
import {ICourse} from '../../../../../../../../../shared/models/ICourse';
import {ITaskUnit} from '../../../../../../../../../shared/models/units/ITaskUnit';

@Component({
  selector: 'app-free-text-unit-form',
  templateUrl: './free-text-unit-form.component.html',
  styleUrls: ['./free-text-unit-form.component.scss']
})
export class FreeTextUnitFormComponent implements OnInit {
  @Input() course: ICourse;
  @Input() lectureId: string;
  @Input() model: ITaskUnit;
  @Input() onDone: () => void;
  @Input() onCancel: () => void;
  freeTextUnit: IFreeTextUnit;

  constructor(private unitService: UnitService,
              private freeTextService: FreeTextService,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.freeTextUnit = new FreeTextUnit(this.course._id);
    this.loadMarkdownFromServer();
  }

  loadMarkdownFromServer() {
    this.freeTextService.getStuff(this.course._id).then(unit => {
      // FIXME: What do I have to do here?
    });
  }

  addUnit() {
    this.unitService.addFreeTextUnit(this.freeTextUnit, this.lectureId)
      .then(
        (unit) => {
          this.snackBar.open('Free text unit saved', '', {duration: 3000});
          this.onDone();
        },
        (error) => console.log(error)
      );
  }
}
