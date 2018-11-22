import {Component, Input, OnInit} from '@angular/core';
import {FreeTextUnit} from '../../models/units/FreeTextUnit';

@Component({
  selector: 'app-free-text-unit',
  templateUrl: './free-text-unit.component.html',
  styleUrls: ['./free-text-unit.component.scss']
})
export class FreeTextUnitComponent implements OnInit {
  @Input() freeTextUnit: FreeTextUnit;
  @Input() theme: string;

  constructor() {
  }

  ngOnInit() {
  }
}
