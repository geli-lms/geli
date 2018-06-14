import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss']
})
export class CookieBannerComponent implements OnInit {
  displayState: string;

  constructor() {
  }

  ngOnInit() {
    const isCookieAccepted = (localStorage.getItem('geli_accept_cookie') === 'true');
    if (isCookieAccepted) {
      this.displayState = 'none';
    } else {
      this.displayState = 'inline-block';
    }
  }

  onAccept() {
    localStorage.setItem('geli_accept_cookie', 'true');
    this.displayState = 'none';
  }
}
