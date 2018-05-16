import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input } from '@angular/core';
import {IResponsiveImageData} from "../../../../../../../shared/models/IResponsiveImageData";

@Component({
  selector: 'app-responsive-image',
  templateUrl: './responsive-image.component.html',
  styleUrls: ['./responsive-image.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResponsiveImageComponent implements OnInit {

  @Input()
  responsiveImageData: IResponsiveImageData;

  constructor() { }

  ngOnInit() {
  }
}
