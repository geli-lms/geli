import { browser, element, by } from 'protractor';

export class WebFrontendPage {
  navigateTo() {
    // call '/' with a timeout of 3 seconds
    return browser.get('/', 3000);
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
}
