import titleize from "titleize";
import { actionCards, cardTypes } from "../namespaces/cardTypes";

// TODO: Add points prop for each card types.
/**
 * UNO card class.
 */
export default class Card {
  /**
   * Creates a new UNO Card.
   * @param {string} color - The color of the card.
   *    Either `red`, `yellow`, `green`, `blue`, or `wild`.
   * @param {string} symbol - The number (in `string`) or symbol of the card.
   *    Check {@link cardTypes} for lists of valid symbols and its name.
   */
  constructor(color, symbol) {
    color = color.toLowerCase();
    symbol = symbol.toLowerCase();

    // Automatically change the `color` to `wild` if its a wild card.
    if (['w', '+4'].includes(symbol))
      color = 'wild';
    else if (color == 'wild')
      throw new Error(`${cardTypes[symbol]} Card cannot have \`wild\` color`);

    if (!'red,yellow,green,blue,wild'.split(',').includes(color))
      throw new RangeError(
        'Invalid color value. ' +
        'Must be either `red`, `yellow`. `green`, `blue`, or `wild`');

    /**
     * The color of the card.
     * @type {string}
     */
    this.color = color;

    /**
     * The number (in `string`) or symbol of the card.
     * @type {string}
     */
    this.symbol = symbol;

    if (symbol.length == 1 && parseInt(symbol) != NaN)
      /**
       * The number of the card. An alias for {@link symbol}
       *    properties if the card is a number card.
       * @type {number}
       */
      this.number = parseInt(symbol);

    /**
     * The name of the card.
     * @type {string}
     */
    this.name = titleize(
      `${color === 'wild' ? '' : color} ${cardTypes[symbol]} Card`).trim();

    // Define the points for each type of cards.
    this.points = 0;
    if (actionCards.includes(symbol))
      if (['w', '+4'].includes(symbol))
        this.points = 50;
      else this.points = 20;
    else
      this.points = parseInt(symbol);
  }

  /**
   * Returns the name of the class.
   * @returns {string}
   */
  static toString() {
    return 'Card';
  }

  /**
   * Returns a string representation of UNO Card.
   * @returns {string}
   */
  toString() {
    return this.name;
  }
}