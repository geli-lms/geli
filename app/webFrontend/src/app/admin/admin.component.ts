import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {TitleService} from '../shared/services/title.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None
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
