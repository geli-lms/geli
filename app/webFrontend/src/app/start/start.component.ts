import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../shared/services/authentication.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
  }

  isLoggedIn() {
    return this.authenticationService.isLoggedIn;
  }
}
