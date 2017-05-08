import { WebFrontendPage } from './app.po';

describe('web-frontend App', () => {
  let page: WebFrontendPage;

  beforeEach(() => {
    page = new WebFrontendPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to geli!');
  });
});
