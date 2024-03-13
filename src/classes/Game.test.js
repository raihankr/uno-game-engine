import Game from "./Game";

/** @type {Game} */
var game;
const players = ['Player 1', 'Player 2', 'Player 3'];

//TODO: Make the tests for the Game class
describe('Game class initialization', () => {
  test.each([
    [11, new Array(11).fill('')],
    [1, ['']]
  ])('Create a game with %d players to throw an error', (n, arr) => {
    expect(() => game = new Game(arr))
      .toThrow(/Too (few|much) players/i);
  });

  test('Succesfully create a game with 3 players', () => {
    expect(() => game = new Game(players))
      .not.toThrow();
  });
});

describe('Start a new round of game', () => {
  test('Create a new round', () => {
    expect(game.newRound(3)).toThrow(RangeError);
    expect(game.newRound(2)).not.toThrow();
  });

  describe('Checks some RoundConfig props', () => {
    test.each([
      ['players', players],
      ['drawPile', game.drawPile],
      ['discardPile', game.discardPile]
    ])('%s props has a valid type structure', (prop, ref) => {
      expect(game.roundConfig[prop]).toStrictEqual(ref);
    });
  })
});