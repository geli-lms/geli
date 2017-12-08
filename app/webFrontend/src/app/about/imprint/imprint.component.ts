import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfigService} from '../../shared/services/data.service';
import {IConfig} from '../../../../../../shared/models/IConfig';
import {MarkdownService} from '../../shared/services/markdown.service';

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
    this.loadImprint();
  }
  loadImprint() {
    this.service.readSingleItem('imprint').then(
      (imprint: any) => {
        this.imprint = imprint;
        this.renderHtml();
      },
      (errorResponse: Response) => {
        this.imprintRendered = '';
      });
  }
  renderHtml() {
    this.imprintRendered = this.mdService.render(this.imprint.configValue);
  }
}
