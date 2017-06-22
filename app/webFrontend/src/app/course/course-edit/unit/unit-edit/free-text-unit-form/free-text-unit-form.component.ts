import {Component, Input, OnInit} from '@angular/core';
import {IFreeTextUnit} from '../../../../../../../../../shared/models/units/IFreeTextUnit';
import {MdSnackBar} from '@angular/material';
import {UnitService} from '../../../../../shared/services/data.service';
import {FreeTextUnit} from '../../../../../models/FreeTextUnit';
import {ICourse} from '../../../../../../../../../shared/models/ICourse';

@Component({
  selector: 'app-free-text-unit-form',
  templateUrl: './free-text-unit-form.component.html',
  styleUrls: ['./free-text-unit-form.component.scss']
})
export class FreeTextUnitFormComponent implements OnInit {
  @Input() course: ICourse;
  @Input() lectureId: string;
  @Input() model: IFreeTextUnit;
  @Input() onDone: () => void;
  @Input() onCancel: () => void;

  constructor(private unitService: UnitService,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    console.log(this.model);
    if (this.isNewModelObj()) {
      this.model = new FreeTextUnit(this.course._id);
    }
  }

  saveUnit() {
    console.log(this.model);

    // If markdown was left empty, define field for db-consistency
    if (this.model.markdown) {
      this.model.markdown = '';
    }

    // Checks if we have to create a new unit or update an existing
    if (this.isNewModelObj()) { // TODO
      // Create new one
      this.unitService.addFreeTextUnit(this.model, this.lectureId)
        .then(
          () => {
            this.snackBar.open('Free text unit saved', '', {duration: 3000});
            this.onDone();
          },
          error => console.log(error)
        );
    } else {
      // Update existing
      this.unitService.updateItem(this.model)
        .then(
          () => {
            this.snackBar.open('Free text unit saved', 'Update', {duration: 2000});
            this.onDone();
          },
          error => console.log(error)
        );
    }
  }

  private isNewModelObj(): boolean {
    return typeof this.model._id === 'undefined';
  }
}
