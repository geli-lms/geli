import {Component, Input, OnInit} from '@angular/core';
import {IFreeTextUnit} from '../../../../../../../../../shared/models/units/IFreeTextUnit';
import {MdSnackBar} from '@angular/material';
import {FreeTextUnitService} from '../../../../../shared/services/data.service';
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

  constructor(private freeTextUnitService: FreeTextUnitService,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    if (!this.model) {
      this.model = new FreeTextUnit(this.course._id);
    }
  }

  saveUnit() {
    // If markdown was left empty, define field for db-consistency
    if (typeof this.model.markdown === 'undefined') {
      this.model.markdown = '';
    }

    // Checks if we have to create a new unit or update an existing
    if (this.isModelNewObj()) {
      // Create new one
      this.freeTextUnitService.createItem({model: this.model, lectureId: this.lectureId})
        .then(
          () => {
            this.snackBar.open('Free text unit saved', '', {duration: 3000});
            this.onDone();
          },
          error => console.log(error)
        );
    } else {
      // Update existing
      delete this.model._course;
      this.freeTextUnitService.updateItem(this.model)
        .then(
          () => {
            this.snackBar.open('Free text unit saved', 'Update', {duration: 2000});
            this.onDone();
          },
          error => console.log(error)
        );
    }
  }

  private isModelNewObj(): boolean {
    return typeof this.model._id === 'undefined';
  }
}
