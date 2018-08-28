import { Component, OnInit, ViewChild } from '@angular/core';
import {ImprintAndInfoService} from '../../shared/services/imprint-and-info.service';
import {TitleService} from '../../shared/services/title.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  renderedContent: string;
  constructor(private imprintService: ImprintAndInfoService,
              private titleService: TitleService) { }

  ngOnInit() {
    this.titleService.setTitle('Privacy');
    this.getData();
  }

  async getData() {
    this.renderedContent = await this.imprintService.loadConfig('privacy');
  }
}
