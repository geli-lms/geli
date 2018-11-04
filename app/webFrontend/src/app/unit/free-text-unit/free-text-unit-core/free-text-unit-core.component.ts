import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MarkdownService} from '../../../shared/services/markdown.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-free-text-unit-core',
  templateUrl: './free-text-unit-core.component.html',
  styleUrls: ['./free-text-unit-core.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FreeTextUnitCoreComponent implements OnInit {
  @Input() markdown: string;
  @Input() theme = 'theme1';

  renderedHtml: string;

  constructor(private mdService: MarkdownService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.renderHtml();
  }

  public renderHtml(): string {
    if (this.mdService && this.markdown) {
      // ugly workaround for id anchors used by markdown-it footnotes :-(
      return this.renderedHtml = <string>this.sanitizer.bypassSecurityTrustHtml(this.mdService.render(this.markdown));
    }
  }

}
