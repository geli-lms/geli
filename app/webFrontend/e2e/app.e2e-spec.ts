import { WebFrontendPage } from './app.po';

describe('web-frontend App', () => {
  let page: WebFrontendPage;

  beforeEach(() => {
    page = new WebFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
