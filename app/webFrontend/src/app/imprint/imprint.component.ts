import {Component, OnInit, ViewChild} from '@angular/core';
import {ImprintAndInfoService} from '../shared/services/imprint-and-info.service';
import {TitleService} from '../shared/services/title.service';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss']
})
export class ImprintComponent implements OnInit {
  renderedContent: string;
  constructor(private imprintService: ImprintAndInfoService,
              private titleService: TitleService) { }

  ngOnInit() {
    this.titleService.setTitle('Imprint');
    this.getData();
  }

  async getData() {
    this.renderedContent = await this.imprintService.loadConfig('imprint');
  }
}
