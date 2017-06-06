import {WebFrontendAbout} from './app.po';

describe('About-page', () => {
  let page: WebFrontendAbout;

  beforeEach(() => {
    page = new WebFrontendAbout();
  });

  it('should have about as h1', () => {
    page.navigateTo();
    expect(page.getH1Text()).toEqual('About');
  });
});
