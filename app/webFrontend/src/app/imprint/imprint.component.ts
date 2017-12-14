import {Component, OnInit, ViewChild} from '@angular/core';
import {IConfig} from '../../../../../shared/models/IConfig';
import {MarkdownService} from '../shared/services/markdown.service';
import {ConfigService} from '../shared/services/data.service';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss']
})
export class ImprintComponent implements OnInit {
  imprint: IConfig;
  imprintRendered: string;
  constructor(private service: ConfigService,
              private mdService: MarkdownService) { }

  ngOnInit() {
    void this.loadImprint();
  }
  async loadImprint() {
    try {
      this.imprint = <IConfig><any> await this.service.readSingleItem('imprint');
      this.renderHtml();
    } catch (error) {
      this.imprintRendered = '';
    }
  }
  renderHtml() {
    this.imprintRendered = this.mdService.render(this.imprint.configValue);
  }
}
