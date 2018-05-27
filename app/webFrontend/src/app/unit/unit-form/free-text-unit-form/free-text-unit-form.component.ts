import {Component, OnInit, ViewChild} from '@angular/core';
import {IFreeTextUnit} from '../../../../../../../shared/models/units/IFreeTextUnit';
import {MatDialog} from '@angular/material';
import {FreeTextUnitService, NotificationService, UnitService} from '../../../shared/services/data.service';
import {FreeTextUnitEditorComponent} from './free-text-unit-editor/free-text-unit-editor.component';
import {FreeTextUnitEditorDialog} from './free-text-unit-editor/free-text-unit-editor-dialog/free-text-unit-editor.dialog';
import {FormControl, FormGroup} from '@angular/forms';
import {UnitFormService} from '../../../shared/services/unit-form.service';

@Component({
  selector: 'app-free-text-unit-form',
  templateUrl: './free-text-unit-form.component.html',
  styleUrls: ['./free-text-unit-form.component.scss']
})
export class FreeTextUnitFormComponent implements OnInit {

  unitForm: FormGroup;

  @ViewChild(FreeTextUnitEditorComponent)
  private freeTextEditor: FreeTextUnitEditorComponent;

  constructor(private freeTextUnitService: FreeTextUnitService,
              private unitService: UnitService,
              public dialog: MatDialog,
              private notificationService: NotificationService,
              private unitFormService: UnitFormService) {}

  ngOnInit() {
    this.unitFormService.headline = 'Free-text';
    this.unitForm = this.unitFormService.unitForm;

    // add a virtual FormControl which binds to model.markdown
    this.unitForm.addControl('markdown', new FormControl((<IFreeTextUnit>this.unitFormService.model).markdown));
  }


  public openFullscreen(): void {
    const dialogRef = this.dialog.open(FreeTextUnitEditorDialog, {
      width: '94vw',
      height: '94vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        markdown: this.unitForm.controls.markdown ? this.unitForm.controls.markdown : '',
        unitForm: this.unitForm
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (typeof result !== 'undefined') {
        // this.unitFormService.model.markdown = result;
        this.unitForm.patchValue({ markdown: result });
      }
    });
  }
}
