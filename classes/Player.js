/**
 * Player class
 */
class Player {
  /**
   * The name of the player
   * @type {string}
   */
  name = 'Player';
  /**
   * Array of cards that belong to the player
   * @type {Card[]}
   * @
   */
  #cards = [];

  /**
   * Creates a new Player
   * @param {string} [name] The name of the player
   */
  constructor(name = 'Player') {
    this.name = name;
  }

  /**
   * Array of cards that belong to the player
   * @type {Card[]}
   */
  get cards() {
    return this.#cards;
  }

  /**
   * Draw a specific amount of cards from cards pile
   * @param {Card[]} pile - Pile of cards to be drawed from
   * @param {number} amount - Amount of cards to be drawed
   */
  drawCard(pile, amount) {
    this.#cards.unshift(pile.splice(0, amount));
  }

  putCard(pile, ) {

  }
}

module.exports = Player;