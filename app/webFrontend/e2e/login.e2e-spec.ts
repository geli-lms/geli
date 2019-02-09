import {WebFrontendLogin} from './app.po';
import {browser} from 'protractor';

describe('Login-form', () => {
  let page: WebFrontendLogin;

  beforeEach(() => {
    page = new WebFrontendLogin();
  });

  it('should have email and password input', async () => {
    await page.navigateTo();

    expect(page.getInputEmail().isPresent()).toBeTruthy();
    expect(page.getInputPassword().isPresent()).toBeTruthy();
  });

  it('show error when email or password invalid', async () => {
    await page.navigateTo();

    const email = page.getInputEmail();
    email.sendKeys('invalidEmail');

    const password = page.getInputPassword();
    password.sendKeys('wrongPassword');

    await page.getLoginButton().click();
    await browser.waitForAngular(); // ensure that there are no running http requests

    expect(page.getSnackBar().getText()).toContain('Login failed: Your login details could not be verified.');
  });

  it('should login with valid credentials', async () => {
    await page.navigateTo();

    const email = page.getInputEmail();
    email.sendKeys('student1@test.local');

    const password = page.getInputPassword();
    password.sendKeys('test1234');

    await page.getLoginButton().click();
    await browser.waitForAngular(); // ensure that there are no running http requests

    expect(page.getSnackBar().getText()).toContain('Login successful');
  });
});
