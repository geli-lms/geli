import {browser, element, by} from 'protractor';

export class WebFrontendPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}

export class WebFrontendAbout {
  navigateTo() {
    return browser.get('/about');
  }

  getH1Text() {
    return element(by.css('app-root h1')).getText();
  }
}

export class WebFrontendLogin {
  navigateTo() {
    return browser.get('/login');
  }

  getInputEmail() {
    return element(by.css('[formcontrolname="email"]'));
  }

  getInputPassword() {
    return element(by.css('[formcontrolname="password"]'));
  }

  getLoginButton() {
    return element(by.css('[type="submit"]'));
  }

  getSnackBar() {
    return element(by.css('simple-snack-bar'));
  }
}
