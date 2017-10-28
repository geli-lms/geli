import {Component, Input, OnInit} from '@angular/core';
import {MarkdownService} from '../../../shared/services/markdown.service';

@Component({
  selector: 'app-free-text-unit-core',
  templateUrl: './free-text-unit-core.component.html',
  styleUrls: ['./free-text-unit-core.component.scss']
})
export class FreeTextUnitCoreComponent implements OnInit {
  @Input() markdown: string;
  renderedHtml: string;

  constructor(private mdService: MarkdownService) {
  }

  ngOnInit() {
    this.renderHtml();
  }

  public renderHtml(): string {
    if (this.mdService) {
      return this.renderedHtml = this.mdService.render(this.markdown);
    }
  }

}
