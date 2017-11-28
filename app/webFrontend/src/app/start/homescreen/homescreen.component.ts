import {Component, OnInit} from '@angular/core';
import {TitleService} from '../../shared/services/title.service';

@Component({
  selector: 'app-homescreen',
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.scss']
})
export class HomescreenComponent implements OnInit {

  constructor(
    private titleService: TitleService
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle('Home');
  }

}
