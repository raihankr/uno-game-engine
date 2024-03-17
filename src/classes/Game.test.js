import Game from './Game';

let players = ['Player 1', 'Player 2', 'PLayer 3'];
let game = new Game(players);

describe('Game', () => {
  describe('#constructor', () => {
    test('error duplicate player', () => {
      expect(() => new Game(['P1', 'P1']))
        .toThrow(/Cannot have duplicate players' name/);
    });

    test.each([
      ['< 2', ['P1']],
      ['> 10', '0123456789a'.split('')],
    ])('error players %s', (desc, players) => {
      expect(() => new Game(players))
        .toThrow(/Too (few|much) players/);
    });
  });

  describe('RoundConfig-dependant methods/getters availability error', () => {
    let game = new Game(players);

    test.each([
      'drawPile',
      'discardPile'
    ])('#%s', prop => {
      expect(() => game[prop]).toThrow(/No available round found/);
    });

    test.each([
      'getPlayerCards',
      'getPlayerCardsByName',
      'draw',
      'play',
      'isPlayable',
      'callUno',
      'endTurn'
    ])('#%s()', prop => {
      expect(() => game[prop]()).toThrow(/No available round found/);
    });
  });
});