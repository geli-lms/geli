import { PageModule } from './page.module';

describe('PageModule', () => {
  let pageModule: PageModule;

  beforeEach(() => {
    pageModule = new PageModule();
  });

  it('should create an instance', () => {
    expect(pageModule).toBeTruthy();
  });
});
