describe('Plugin Test', () => {
  it('Vertical swipe test', async () => {
    await browser.pause(2000);
    await browser.$('~login').click();
    await browser.$('~verticalSwipe').click();
    await browser.pause(2000);
  });
});
