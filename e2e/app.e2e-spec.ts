import { OptProjectPage } from './app.po';

describe('opt-project App', () => {
  let page: OptProjectPage;

  beforeEach(() => {
    page = new OptProjectPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
