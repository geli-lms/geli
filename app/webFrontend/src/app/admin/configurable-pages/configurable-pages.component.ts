import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configurable-pages',
  templateUrl: './configurable-pages.component.html',
  styleUrls: ['./configurable-pages.component.scss']
})
export class ConfigurablePagesComponent implements OnInit {

  edit: boolean;

  constructor() {
    this.edit = false;
  }

  ngOnInit() {
  }

  addPage() {
    this.edit = true;
  }
}
