import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-button-save-cancel',
  templateUrl: './button-save-cancel.component.html',
  styleUrls: ['./button-save-cancel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonSaveCancelComponent implements OnInit {

  @Input()
  saveButtonDisabled: boolean;

  @Output()
  save: EventEmitter<any> = new EventEmitter();
  @Output()
  cancel: EventEmitter<any> = new EventEmitter();

  constructor() {
    // sets save button disabled default: false
    this.saveButtonDisabled = false;
  }

  ngOnInit() {
  }

  emitSave(): void {
    this.save.emit(null);
  }

  emitCancel(): void {
    this.cancel.emit(null);
  }
}
