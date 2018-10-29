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
  public freeTextEditor: FreeTextUnitEditorComponent;

  constructor(public dialogRef: MatDialogRef<FreeTextUnitEditorDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.dialogRef.beforeClose().subscribe(data => {
      // hack to pass data back after ESC-Close
      this.dialogRef.close(this.freeTextEditor.unitForm.controls.markdown.value);
    });
  }


  onCloseClick(): any {
    return this.dialogRef.close(this.freeTextEditor.unitForm.controls.markdown.value);
  }
}
