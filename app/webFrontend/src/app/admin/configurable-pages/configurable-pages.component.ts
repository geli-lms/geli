import { Component, OnInit } from '@angular/core';
import {IPage} from '../../../../../../shared/models/IPage';
import {PageService} from '../../shared/services/data/page.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-configurable-pages',
  templateUrl: './configurable-pages.component.html',
  styleUrls: ['./configurable-pages.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class ConfigurablePagesComponent implements OnInit {

  edit: boolean;
  pages: IPage[];
  columnsToDisplay: string[] = ['path', 'title', 'language', 'accessLevel'];
  expandedPage: IPage;

  constructor(private pageService: PageService) {
    this.edit = false;
  }

  ngOnInit() {
    this.getPageData();
  }

  async getPageData() {
    try {
      this.pages = <IPage[]>await this.pageService.readItems();
      const debug = 0;
    } catch (error) {
      const debug = 0;
    }
  }

  addPage() {
    this.edit = true;
  }

  editExistingPage(page: IPage) {
    if (this.expandedPage === page) {
      this.expandedPage = null;
    } else {
      this.expandedPage = page;
    }
  }

  onSave(page: IPage) {
    this.getPageData();
    this.onCancel(page);
  }

  onCancel(page: IPage) {
    if (this.expandedPage === page) {
      this.expandedPage = null;
    } else {
      this.edit = false;
    }
  }
}
