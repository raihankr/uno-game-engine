import { actionCards } from '../namespaces/cardTypes';
import shuffle from '../utils/shuffle';
import Card from './Card';

/**
 * The configuration object for a round in a game.
 * @typedef {object} RoundConfig
 * @property {boolean} isFinished - Returns `true` if the round is finished.
 * @property {boolean} isTurnClockwise - Returns `true` if the direction of play
 *    is in clockwise direction.
 * @property {string[]} players - Array of players' name in the current round.
 * @property {number} turn - Returns the index of player in the game in the
 *    current turn.
 * @property {Card[]} drawPile - Array of Cards in the draw pile.
 * @property {Card[]} discardPile - Array of Cards in the discard pile.
 * @property {Array<Card[]>} playersCards - Array of player's cards.
 * @property {number|null} mustCallsUno - The index of the player who must calls
 *    'UNO' because they have only one card remaining on their hands.
 * @property {string[]} winners - Indexes of players whose already wins the
 *    game.
*/

// TODO: Add custom rules configuration to the game.
// TODO: Add objectives options; Whether playing for points or race (winners
//    ranking decided by the order of players going out the game).

/**
 * The UNO Game class.
 */
export default class Game {
  /**
   * Creates a new UNO game.
   * @param {string[]} players Array of players' name.
   */
  constructor(players) {
    /**
     * Array of players' name.
     * @type {string[]}
     */
    this.players = [...new Set(players)];
    /**
     * The configuration of current round in the game.
     * @type {RoundConfig}
     */
    this.roundConfig = null;

    if (this.players.length !== players.length)
      throw new Error('Cannot have duplicate players\' name.');

    if (this.players?.length < 2)
      throw new RangeError('Too few players. Minimal 2 players');
    if (this.players?.length > 10)
      throw new RangeError('Too much players. Maximal 10 players');
  }

  /**
   * Array of cards in the draw pile of the current round.
   * @type {Card[]}
   */
  get drawPile() {
    if (!this.roundConfig || this.roundConfig?.isFinished)
      throw new Error('No available round found in this game');
    return this.roundConfig.drawPile;
  }

  /**
   * Array of cards in the discard pile of the current round.
   * @type {Card[]}
   */
  get discardPile() {
    if (!this.roundConfig || this.roundConfig?.isFinished)
      throw new Error('No available round found in this game');
    return this.roundConfig.discardPile;
  }

  /**
   * Returns an array of cards that belong to the specified player.
   * @param {number} playerId - The index of the player in the current game.
   * @returns {Card[]}
   */
  getPlayerCards(playerId) {
    if (!this.roundConfig || this.roundConfig?.isFinished)
      throw new Error('No available round found in this game');

    if (playerId >= this.roundConfig.players.length || playerId < 0)
      throw new RangeError(
        'No player found with the specified id: ' + playerId);

    return this.roundConfig.playersCards[playerId];
  }

  /**
   * Returns an array of cards that belong to the specified player.
   * @param {string} playerName - The name of the player.
   * @returns {Card[]}
   */
  getPlayerCardsByName(playerName) {
    if (!this.roundConfig || this.roundConfig?.isFinished)
      throw new Error('No available round found in this game');

    return this.getPlayerCards(this.roundConfig.players.indexOf(playerName));
  }

  /**
   * Initialize a new UNO game round.
   * @param {number} startingPLayer - The index of the first player to
   *    play in the round.
   * @returns {RoundConfig}
   */
  newRound(startingPLayer = 0) {
    if (startingPLayer < 0 || startingPLayer >= this.players.length)
      throw new RangeError(
        'The starting player index must be in the range of players\' ' +
        'indexes.');

    let isTurnClockwise = true;
    let turn = startingPLayer;

    const players = [...this.players];

    const drawPile = [];

    // Add for each color of cards:
    // 1 x 0 card, 2 x 1-9 cards, 2 x reverse, 2 x skip cards,
    // 2 x draw two cards, 4 x wild cards, 4 x wild draw four cards
    for (let color of 'red,yellow,green,blue'.split(',')) {
      drawPile.push(new Card(color, '0'));

      for (let symbol of '12345678rs'.split('').concat('+2')) {
        drawPile.push(new Card(color, symbol));
        drawPile.push(new Card(color, symbol));
      }

      for (let symbol of ['w', '+4'])
        for (let i = 0; i < 4; i++)
          drawPile.push(new Card('wild', symbol));
    }
    shuffle(drawPile);

    const discardPile = [];

    const playersCards = new Array(players.length).fill([]);

    // Give 7 cards from draw pile to each players
    for (let playerId in players)
      for (let i = 0; i < 7; i++)
        playersCards[playerId].push(drawPile.pop());

    let mustCallsUno = null;

    const winners = [];

    this.roundConfig = {
      isFinished: false,
      isTurnClockwise,
      players,
      turn,
      drawPile,
      discardPile,
      playersCards,
      mustCallsUno,
      winners
    };

    // Take the first discard card from the drawing pile.
    const firstDiscard = () => {
      discardPile.push(drawPile.pop());
      if (actionCards.includes(discardPile[0].symbol))
        switch (discardPile[0].symbol) {
          case 'r':
            this.roundConfig.isTurnClockwise = false;
          // falls through
          case 's':
            this.endTurn();
            break;
          case '+2':
            this.draw(this.roundConfig.turn, 2);
            break;
          case '+4':
            drawPile.push(discardPile.pop());
            shuffle(drawPile);
            firstDiscard();
        }
    };
    firstDiscard();

    return this.roundConfig;
  }

  /**
   * Draw a specified amount of cards from the draw pile to the specified
   *    player.\
   * Returns an array of cards that drawed.
   * @param {number} playerId - The index or the name of the player.
   * @param {number} [amount] - The amount of the cards to be drawed.
   */
  draw(playerId, amount) {
    if (!this.roundConfig || this.roundConfig?.isFinished)
      throw new Error('No available round found in this game');

    // If the draw pile doesn't have enough card to be drawed,
    // take all cards from the discard pile but the last card and reshuffle it
    // along with the cards from the draw pile.

    this.#checksUnoCall();

    if (amount > this.drawPile.length) {
      this.drawPile
        .push(this.discardPile.splice(0, this.discardPile.length - 1)[0]);
      shuffle(this.drawPile);
    }

    let drawedCards = this.drawPile.splice(-amount, amount);
    this.getPlayerCards(playerId)
      .push(...drawedCards);

    // Handle if the player in turn should play the drawed card or just
    // skip to next player turn.
    if (
      playerId == this.turn &&
      amount == 1 &&
      this.isPlayable(drawedCards)
    ) {
      /**
       * Decide whether the player wants to play the drawed card immediately or
       *    just keep the drawed cards and end the current turn.
       * @param {boolean} end - `false` if the player wants to play the drawed
       *    card immediately. Otherwise `true` will keep the drawed cards and
       *    end the current turn
       */
      const shouldEndTurn = (end = false) => {
        if (end) this.endTurn();
        else this.play(
          this.getPlayerCards(playerId).length - 1, null, playerId);
      };
      return shouldEndTurn;
    } else this.endTurn();
    return null;
  }

  /**
   * Play a card; Put the played card into the discard pile.\
   * Automatically trigger end current turn if playing action cards.
   * Returns the played card.
   * @param {number} cardId - The index of the card in the player's cards that
   *    will be played.
   * @param {string} [color] - The color for the next turn if the player plays
   *    wild card. You can omit this parameter by providing `null` instead.
   * @param {number} [playerId] - The index of the player, default to the index
   *    of the current player in turn.
   * @returns {Card}
   */
  play(cardId, color = null, playerId = this.roundConfig?.turn) {
    if (!this.roundConfig || this.roundConfig?.isFinished)
      throw new Error('No available round found in this game');

    if (playerId !== this.roundConfig.turn)
      throw new Error(
        `Is not currently ${this.roundConfig.players[playerId]} turn.` +
        ' Cannot jump-in');

    if (cardId < 0 || cardId >= this.getPlayerCards().length)
      throw new RangeError('No card found with the specified id: ' + cardId);

    this.#checksUnoCall();

    let willPlay = this.getPlayerCards(playerId)[cardId];

    if (willPlay.color == 'wild') {
      if (!color)
        throw new Error('Must specify color param if plays the wild card');
      else if (!'red,yellow,green,blue'.split(',').includes(color)) {
        throw new RangeError('Invalid color value: ' + color);
      }
    }

    let lastCard = this.discardPile.slice(-1);

    // Play the cards if it match the conditions.
    if (
      this.isPlayable(willPlay) ||
      // For if the first discard is a wild card because its color prop
      // is still  `wild` (not yet changed to the 4 valid colors props)
      // A wild card will automatically change its color properties after
      // the player decides what color to play next.
      lastCard.color == 'wild'
    ) this.discardPile.push(this.getPlayerCards().splice(cardId, 1)[0]);
    else
      throw new Error('The specified card is not currently playable');

    // If the played card is a wild card,
    // Change its color to the specified color by the player
    willPlay.color = color ?? willPlay.color;

    // Handle playing action cards.
    if (actionCards.includes(willPlay.symbol))
      this.#cardsActions[willPlay.symbol]();
    else this.endTurn();

    return willPlay;
  }

  /**
   * Checks if the specified cards is playable.\
   * If the subject is a single card, returns the card if playable.\
   * If the subejct is an array of cards, returns an array of playable cards.\
   * Otherwise return `false`.
   * @param {Card|Card[]} cards - The Card or array of cards to check.
   * @returns {Card|Card[]|boolean}
   */
  isPlayable(cards) {
    if (!this.roundConfig || this.roundConfig?.isFinished)
      throw new Error('No available round found in this game');

    let lastCard = this.roundConfig.discardPile.slice(-1);

    if (cards instanceof Array)
      return cards.map(card => {
        if (
          lastCard.symbol === card.symbol ||
          lastCard.color === card.color ||
          card.color === 'wild'
        ) return card;
      });

    else if (cards instanceof Card)
      if (
        lastCard.symbol === cards.symbol ||
        lastCard.color === cards.color ||
        cards.color === 'wild'
      ) return cards;
      else return false;

    else throw new TypeError(
      'Parameter `cards` cannot accept the received object type. ' +
      'Accepted types: `Card` or `Array<Card>`');
  }

  /**
   * Calls 'UNO' for the specified player after playing their penultimate card
   *    to avoids penalties and warns other players.
   * @param {number} playerId - The index of the player who will calls 'UNO'.
   */
  callUno(playerId) {
    if (!this.roundConfig || this.roundConfig?.isFinished)
      throw new Error('No available round found in this game');

    if (playerId === this.roundConfig.mustCallsUno)
      this.roundConfig.mustCallsUno = null;
    else this.#checksUnoCall();
  }

  /**
   * Checks whether the previous player has to call 'UNO' or not and applies the
   * penalties if the player with one remaining card didn't call 'UNO'.
   */
  #checksUnoCall() {
    if (!this.roundConfig || this.roundConfig?.isFinished)
      throw new Error('No available round found in this game');

    // Checks if there is any player who must calls 'UNO' because they have only
    // one card remaining.
    if (this.roundConfig.mustCallsUno !== null) {
      // The previous player get a penalty because didn't calls 'UNO' until the
      // the next player plays.
      this.draw(this.roundConfig.mustCallsUno, 2);
      this.roundConfig.mustCallsUno = null;
    }
  }

  /**
   * End current player's turn.
   */
  endTurn() {
    if (!this.roundConfig || this.roundConfig?.isFinished)
      throw new Error('No available round found in this game');

    let currPlayer = this.roundConfig.turn;

    // Checks if the current player in turn has only one remaining card.
    if (this.getPlayerCards(currPlayer).length === 1)
      this.roundConfig.mustCallsUno = currPlayer;
    if (this.getPlayerCards(currPlayer).length === 0) {
      this.roundConfig.winners.push(
        this.roundConfig.players[this.roundConfig.turn]);
      this.roundConfig.players.splice(this.roundConfig.turn, 1);

      if (this.roundConfig.players.length < 2) {
        this.roundConfig.winners.push(...this.roundConfig.players);
        return this.roundConfig.isFinished = true;
      }
    }

    // Switch to the next turn
    this.roundConfig.turn +=
      this.roundConfig.isTurnClockwise ? 1 : -1;

    if (this.roundConfig.turn < 0)
      this.roundConfig.turn = this.roundConfig.players.length - 1;
    else if (this.roundConfig.turn >= this.roundConfig.players.length)
      this.roundConfig.turn = 0;
  }

  /**
   * Lists all actions cards and its corresponding side effects/actions methods.
   */
  #cardsActions = {
    r: this.#reverseEffect,
    s: this.#skipEffect,
    w: () => { },
    '+2': this.#drawTwoEffect,
    '+4': this.#drawFourEffect,
  };

  /**
   * Triggers the side effect/action for reverse cards.
   */
  #reverseEffect() {
    this.roundConfig.isTurnClockwise = !this.roundConfig.isTurnClockwise;
    if (this.roundConfig.players.length === 2)
      return;
    else this.endTurn();
  }

  /**
   * Triggers the side effect/action for skip carda.
   */
  #skipEffect() {
    this.endTurn();
    this.endTurn();
  }

  /**
   * Triggers the side effect/action for draw two cards.
   */
  #drawTwoEffect() {
    this.endTurn();
    this.draw(this.roundConfig.turn, 2);
    this.endTurn();
  }

  /**
   * Triggers the side effect/action for wild draw four cards.
   */
  #drawFourEffect() {
    this.endTurn();
    this.draw(this.roundConfig.turn, 4);
    this.endTurn();
  }
}