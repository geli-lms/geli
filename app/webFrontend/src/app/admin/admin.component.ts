import {Component, OnInit} from '@angular/core';
import {TitleService} from '../shared/services/title.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(
    private titleService: TitleService
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle('Admin');
  }

}
