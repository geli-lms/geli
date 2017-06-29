import {Component, Input, OnInit} from '@angular/core';
import {FreeTextUnit} from '../../../../models/FreeTextUnit';
import {MarkdownService} from '../../../../shared/services/markdown.service';

@Component({
  selector: 'app-free-text-unit',
  templateUrl: './free-text-unit.component.html',
  styleUrls: ['./free-text-unit.component.scss']
})
export class FreeTextUnitComponent implements OnInit {
  @Input() freeTextUnit: FreeTextUnit;

  constructor(private mdService: MarkdownService) { }

  ngOnInit() {
  }

  public getMarkdownAsHtml(): string {
    return this.mdService.render(this.freeTextUnit.markdown);
  }

}
