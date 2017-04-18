import { browser, element, by } from 'protractor';

export class WebFrontendPage {
  navigateTo() {
    return browser.get('/', 1000);
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
