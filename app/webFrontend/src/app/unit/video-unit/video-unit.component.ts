import {Component, OnInit, Input} from '@angular/core';
import {IVideoUnit} from '../../../../../../shared/models/units/IVideoUnit';

@Component({
  selector: 'app-video-unit',
  templateUrl: './video-unit.component.html',
  styleUrls: ['./video-unit.component.scss']
})
export class VideoUnitComponent implements OnInit {

  @Input() videoUnit: IVideoUnit;

  constructor() {
  }

  ngOnInit() {
  }

}
