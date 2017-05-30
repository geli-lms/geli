import { browser, element, by } from 'protractor';

export class WebFrontendPage {
  static navigateTo() {
    return browser.get('/');
  }

  static getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}

export class WebFrontendAbout {
  static navigateTo() {
    return browser.get('/about');
  }

  static getH1Text() {
    return element(by.css('app-root h1')).getText();
  }
}
