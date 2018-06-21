import {WebFrontendLogin} from './app.po';

describe('Login-form', () => {
  let page: WebFrontendLogin;

  beforeEach(() => {
    page = new WebFrontendLogin();
  });

  it('should have email and password input', () => {
    page.navigateTo();

    expect(page.getInputEmail().isPresent()).toBeTruthy();
    expect(page.getInputPassword().isPresent()).toBeTruthy();
  });

  it('show error when email or password empty', () => {
    page.navigateTo();

    page.getLoginButton().click().then(function () {
      expect(page.getSnackBar().getText()).toContain('Login failed: auth.loginFailedError.undefined');
    });
  });

  it('should login with valid credentials', () => {
    page.navigateTo();

    const email = page.getInputEmail();
    email.sendKeys('student1@test.local');

    const password = page.getInputPassword();
    password.sendKeys('test1234');

    page.getLoginButton().click().then(function () {
      expect(page.getSnackBar().getText()).toContain('Login successful');
    });
  });
});
