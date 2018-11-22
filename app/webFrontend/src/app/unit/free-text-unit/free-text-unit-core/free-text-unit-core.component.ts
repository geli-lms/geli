import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MarkdownService} from '../../../shared/services/markdown.service';

@Component({
  selector: 'app-free-text-unit-core',
  templateUrl: './free-text-unit-core.component.html',
  styleUrls: ['./free-text-unit-core.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FreeTextUnitCoreComponent implements OnInit {
  @Input() markdown: string;
  @Input() theme;

  renderedHtml: string;

  constructor(private mdService: MarkdownService) {
  }

  ngOnInit() {
    this.renderHtml();
  }

  public renderHtml(): string {
    if (this.mdService && this.markdown) {
      return this.renderedHtml = this.mdService.render(this.markdown);
    }
  }

}
