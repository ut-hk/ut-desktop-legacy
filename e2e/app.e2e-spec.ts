import { UtDesktopPage } from './app.po';

describe('ut-desktop App', () => {
  let page: UtDesktopPage;

  beforeEach(() => {
    page = new UtDesktopPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
