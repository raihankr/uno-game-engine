import shuffle from "../utils/shuffle";
import Card from "./Card";

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

/**
 * The UNO Game class
 */
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
    this.roundConfig = null;

    if (this.players.length < 2)
      throw new RangeError('Too few players. Minimal 2 players');
    if (this.players.length > 10)
      throw new RangeError('Too much players. Maximal 10 players');
  }

  /**
   * Array of cards in the draw pile of the current round.
   * @type {Card[]}
   */
  get drawPile() {
    if (!this.roundConfig)
      throw new Error('No available round found in this game');
    return this.roundConfig.drawPile;
  }

  /**
   * Array of cards in the discard pile of the current round.
   * @type {Card[]}
   */
  get discardPile() {
    if (!this.roundConfig)
      throw new Error('No available round found in this game');
    return this.roundConfig.discardPile;
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
    
    // TODO: Initialize the discard pile
    // 1. Draw the first card to the discard pile
    // 2. Check if the first card valid and (not a wild draw four card)
    // 2.a If the first card is not valid, undraw and reshuffle the draw pile.
    // 2.b If the first card is an action card, do it action

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
    if (!this.roundConfig)
      throw new Error('No available round found in this game');

    if (amount > this.drawPile.length) {
      this.drawPile
        .push(this.discardPile.splice(0, this.discardPile.length - 1));

      this.drawPile = shuffle(this.drawPile);
    }

    this.getPlayerCards(playerId)
      .push(this.drawPile.splice(-amount, amount));
  }

  /**
   * Play a card; Put the played card into the discard pile.\
   * Returns the played card
   * @param {number} playerId - The index of the player
   * @param {number} cardId - The index of the card in the player's cards that will be played
   * @param {string} [color] - The color for the next turn if the player plays wild card
   * @returns {Card}
   */
  play(playerId, cardId, color) {
    if (!this.roundConfig)
      throw new Error('No available round found in this game');

    let lastCard = this.discardPile.slice(-1);

    if (cardId < 0 || cardId >= this.getPlayerCards().length)
      throw new RangeError('No card found with the specified id: ' + id);

    let willPlay = this.getPlayerCards(playerId)[cardId];

    if (willPlay.color == 'wild') {
      if (!color)
        throw new Error('Must specify color param if plays the wild card')
      else if (!'red,yellow,green,blue'.split(',').includes(color)) {
        throw new RangeError('Invalid color value: ' + color);
      }
    }

    if (
      lestCard.symbol === willPlay.symbol ||
      lastCard.color === willPlay.color ||
      willPlay.color === 'wild'
    ) this.discardPile.push(this.getPlayerCards().splice(cardId, 1));
    else {
      throw new Error('The specified card is not currently playable');
    }

    willPlay.color = color;

    return willPlay;
  }

  /**
   * Returns an array of cards that belong to the specified player.
   * @param {number} playerId - The index of the player in the current game.
   * @returns {Card[]}
   */
  getPlayerCards(playerId) {
    if (!this.roundConfig)
      throw new Error('No available round found in this game');

    if (playerId >= this.players.length || playerId < 0)
      throw new RangeError('No player found with the specified id: ' + playerId);

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