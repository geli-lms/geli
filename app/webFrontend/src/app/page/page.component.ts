import { Component, OnInit } from '@angular/core';
import {PageService} from '../shared/services/data/page.service';
import {MarkdownService} from '../shared/services/markdown.service';
import {IPage} from '../../../../../shared/models/IPage';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  page: IPage;
  renderedContent;

  constructor(private pageService: PageService,
              private markdownService: MarkdownService) { }

  ngOnInit() {
    this.getPageContent();
  }

  async getPageContent() {
    this.page = <IPage>await this.pageService.getPageContent('imprint');
    this.renderedContent = this.markdownService.render(this.page.content);
  }
}
