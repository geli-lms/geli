import { Component, OnInit, ViewEncapsulation, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-button-save-cancel',
  templateUrl: './button-save-cancel.component.html',
  styleUrls: ['./button-save-cancel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonSaveCancelComponent implements OnInit {

  @Output()
  save: EventEmitter<any> = new EventEmitter();
  @Output()
  cancel: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {
  }

  emitSave(): void {
    this.save.emit(null);
  }

  emitCancel(): void {
    this.cancel.emit(null);
  }
}
