/**
 * The configuration object for a round in a game.
 * @typedef {object} RoundConfig
 * @property {boolean} isFinished - Returns `true` if the round is finished.
 * @property {boolean} isTurnClockwise - Returns `true` if the direction of play is in clockwise direction.
 * @property {number} turn - Returns the index of player in the game in the current turn.
 * @property {Card[]} drawPile - Array of Cards in the draw pile
 * @property {Card[]} discardPile - Array of Cards in the discard pile
 * @property {Array<Card[]>} playersCards - Array of player's cards
 */

import shuffle from "../utils/shuffle";
import Card from "./Card";

export default class Game {
  /**
   * Creates a new UNO game.
   * @param {String[]} players Array of players' name.
   */
  constructor(players) {
    /**
     * Array of players' name.
     * @type {String[]}
     */
    this.players = players;
    /**
     * The configuration of current round in the game.
     * @type {RoundConfig}
     */
    this.roundConfig = {}

    if (this.players.length < 2)
      throw new RangeError('Too few players. Minimal 2 players');
    if (this.players.length > 10)
      throw new RangeError('Too much players. Maximal 10 players');
  }

  /**
   * Initialize a new UNO game round.
   * @param {number|string} startingPLayer - The index of the first player to play in the round.
   * @returns {RoundConfig}
   */
  newRound(startingPLayer = 0) {
    if (startingPLayer < 0 || startingPLayer > this.players.length)
      throw new RangeError('The starting player index must be in the range of the players\' indexes.')

    let drawPile = [];
    for (let color of 'red,yellow,green,blue'.split(',')) {
      drawPile.push(new Card(color, '0'))

      for (let symbol of '123456789rs'.split('').push('+2')) {
        drawPile.push(new Card(color, symbol))
        drawPile.push(new Card(color, symbol))
      }

      for (let symbol of ['w', '+4'])
        for (let _ in Array(4).fill())
          drawPile.push(new Card('wild', symbol));
    }
    drawPile = shuffle(drawPile());

    let discardPile = [];

    let playersCards = new Array(this.players.length).fill([]);

    for (let playerId in this.players) {
      for (let _ of Array(7).fill())
        playersCards[playerId].push(drawPile.pop());
    }

    return this.roundConfig = {
      isFinished: false,
      isTurnClockwise: true,
      turn: startingPLayer,
      drawPile,
      discardPile,
      playersCards
    };
  }

  /**
   * Draw a specified amount of cards from the draw pile to the specified player.\
   * Returns an array of cards that drawed
   * @param {number|string} playerId - The index or the name of the player
   * @param {number} [amount] - The amount of the cards to be drawed
   * @returns {Card[]}
   */
  draw(playerId, amount) {

  }

  put(player, cardId) {
    
  }

  /**
   * Returns an array of cards that belong to the specified player.
   * @param {number} playerId - The index of the player in the current game.
   * @returns {Card[]}
   */
  getPlayerCards(playerId) {
    return this.roundConfig.playersCards[playerId];
  }

  /**
   * Returns an array of cards that belong to the specified player.
   * @param {string} playerName - The name of the player.
   * @returns {Card[]}
   */
  getPlayerCardsByName(playerName) {
    return this.getPlayerCards(this.players.indexOf(playerName));
  }
}

new Game().get