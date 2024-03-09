/**
 * UNO card class
 */
class Card {
  /**
 * The name of the card. Automatically filled. Unchangeable
 * @type {string}
 */
  name = '';
  /**
 * The color of the card. Unchangeable
 * @type {string}
 */
  color;

  /**
   * Create a new Card
   * @param {string} color - The color of the card. Either `red`, `yellow`, `green`, `blue`, or `wild`
   */
  constructor(color) {
    if (!'red,yellow,green,blue,wild'.split(',').includes(color))
      throw new RangeError('Invalid color value');

    this.color = color.toLowerCase();
  }
}

/**
 * UNO number card class
 * @extends Card
 */
class NumberCard extends Card {
  /**
   * Create a new NumberCard
   * @param {string} color - The color of the card
   * @param {integer} number - The number of the card `1-9`
   */
  constructor(color, number) {
    super(color)
    this.number = number;
    this.name =  `${color} ${number} card`
  }
}

new NumberCard()

module.exports = {
  Card,
  NumberCard
};