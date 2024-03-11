import Card from "./Card";

describe('Checks invalid color cards', () => {
  test.each([
    'Black',
    'Colorful',
    'Purple'
  ])('`%s` color is invalid', color => {
    expect(() => new Card(color, '1')).toThrow(/invalid color/i);
  });
});

describe('Check wild card', () => {
  test.each([
    ['Wild Draw Four', '+4'],
    ['Wild', 'w']
  ])('%s card has `wild` color', (name, symbol) => {
    expect(new Card('blue', symbol).color).toBe('wild');
  });
});

describe('Prevent `wild` color for regular cards', () => {
  test.each([
    ['Number One', '1'],
    ['Reverse', 'r'],
    ['Skip', 's'],
    ['Draw two', '+2']
  ])('`%s` cards cannot be `wild`', (name, symbol) => {
    expect(() => new Card('wild', symbol))
      .toThrow(/Card cannot have `wild` color/i);
  });
});

describe('Checks card names', () => {
  test.each([
    ['0', 'Green Zero Card'],
    ['r', 'Green Reverse Card'],
    ['s', 'Green Skip Card'],
    ['w', 'Wild Card'],
    ['+2', 'Green Draw Two Card'],
    ['+4', 'Wild Draw Four Card'],
  ])('`%s` card has valid names', (symbol, name) => {
    expect(new Card('green', symbol).toString()).toBe(name);
  });
});