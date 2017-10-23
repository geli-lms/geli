import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-unit-menu',
  templateUrl: './unit-menu.component.html',
  styleUrls: ['./unit-menu.component.scss']
})
export class UnitMenuComponent implements OnInit {

  @Output() onAddUnit = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  public addUnit(type: string) {
    this.onAddUnit.emit(type);
  }
}
