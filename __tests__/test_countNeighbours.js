jest.unmock('../src/App'); // unmock to use the actual implementation of sum

describe('count neighbours', () => {
  it('adds 1 + 2 to equal 3', () => {
    const app = require('../src/App');
    expect(app.onFirstRow(2)).toBe(true);
  });
});
