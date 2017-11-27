import {Component, OnInit} from '@angular/core';
import {TitleService} from '../shared/services/title.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(
    private titleService: TitleService
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle('About');
  }

}
