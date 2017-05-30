import { browser, element, by } from 'protractor';

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
