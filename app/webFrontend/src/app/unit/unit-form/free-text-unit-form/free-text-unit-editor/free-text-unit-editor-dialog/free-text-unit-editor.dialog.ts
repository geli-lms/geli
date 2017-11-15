import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FreeTextUnitEditorComponent} from '../free-text-unit-editor.component';

@Component({
  selector: 'app-free-text-unit-editor-dialog',
  templateUrl: './free-text-unit-editor.dialog.html',
  styleUrls: ['./free-text-unit-editor.dialog.scss']
})
export class FreeTextUnitEditorDialog implements OnInit {
  @ViewChild(FreeTextUnitEditorComponent)
  private freeTextEditor: FreeTextUnitEditorComponent;

  constructor(public dialogRef: MatDialogRef<FreeTextUnitEditorDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  onCloseClick(): any {
    return this.dialogRef.close(this.freeTextEditor.markdown);
  }
}
