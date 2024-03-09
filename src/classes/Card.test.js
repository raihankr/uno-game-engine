import titleize from "titleize";
import Card from "./Card";
import { cardTypes } from "../namespaces/cardTypes";

describe('checks invalid color cards', () => {
  test.each([
    'black',
    'colorful',
    'purple'
  ])('\'%s\' color is invalid', color => {
    expect(() => new Card(color, '1')).toThrow(/invalid color/i)
  });
});

describe('check wild card', () => {
  test.each([
    '+4', 'w'
  ])('`%s` card has `wild` color', symbol => {
    expect(new Card('blue', symbol).color).toBe('wild');
  });
});

describe('prevent `wild` color for regular cards', () => {
  test.each([
    '1', 'r', 's', '+2'
  ])('`%s` cards cannot be `wild`', symbol => {
    expect(() => new Card('wild', symbol)).toThrow(/Card cannot have `wild` color/i)
  })
});

describe('checks card names', () => {
  test.each([
    ['0', 'Green Zero Card'],
    ['r', 'Green Reverse Card'],
    ['s', 'Green Skip Card'],
    ['w', 'Wild Card'],
    ['+2', 'Green Draw Two Card'],
    ['+4', 'Wild Draw Four Card'],
  ])('`%s` card has valid names', (symbol, name) => {
    expect(new Card('green', symbol).toString()).toBe(name)
  })
});