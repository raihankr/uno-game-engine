import Game from './Game';

let players = ['Player 1', 'Player 2', 'PLayer 3'];
/** @type {Game} */
let game;

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

    test('create a new game', () => {
      expect(game = new Game(players)).toBeInstanceOf(Game);
    });
  });

  describe('#newRound', () => {
    test('error starting player index not in range', () => {
      expect(() => game.newRound(3)).toThrow(/Must be in the range/i);
      expect(() => game.newRound(-1)).toThrow(/Must be in the range/i);
    });

    test('create a new round', () => {
      game.newRound();
      expect(game.roundConfig).not.toBeNull();
    });

    describe('.players', () => {
      test('checks reference (clone of Game#players)', () => {
        expect(game.roundConfig.players).not.toBe(game.players);
      });
    });
  });

  describe('#drawPile', () => {
    test('checks reference', () => {
      expect(game.drawPile).toStrictEqual(game.roundConfig.drawPile);
    });
  });

  describe('#discardPile', () => {
    
  });

  describe('roundConfig-dependant methods/getters availability error', () => {
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