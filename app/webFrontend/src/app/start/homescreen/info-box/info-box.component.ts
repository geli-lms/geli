import {Component, OnInit} from '@angular/core';
import {ImprintAndInfoService} from '../../../shared/services/imprint-and-info.service';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent implements OnInit {
  contentRendered: string;


  constructor(private infoBoxService: ImprintAndInfoService) {
  }

  ngOnInit() {
    this.infoBoxService.loadConfig('infoBox').then((str => {
      this.contentRendered = str;
    }));
  }
}
