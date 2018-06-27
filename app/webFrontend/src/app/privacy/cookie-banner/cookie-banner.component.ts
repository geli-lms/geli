import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-cookie-banner',
  templateUrl: './cookie-banner.component.html',
  styleUrls: ['./cookie-banner.component.scss']
})
export class CookieBannerComponent implements OnInit {

  isCookieAccepted: boolean;

  constructor() {
  }

  ngOnInit() {
    this.isCookieAccepted = (localStorage.getItem('geli_accept_cookie') === 'true');
    }


  onAccept() {
    localStorage.setItem('geli_accept_cookie', 'true');
    this.isCookieAccepted = true;
  }
}
