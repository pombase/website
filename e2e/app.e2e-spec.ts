import { PombaseWwwNewPage } from './app.po';

describe('pombase-www-new App', function() {
  let page: PombaseWwwNewPage;

  beforeEach(() => {
    page = new PombaseWwwNewPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
