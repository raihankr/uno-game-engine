class Game {
  #players = [];
  #points = new Map();
  #roundConfig;
  #type = '';
  #rules = new Map();

  constructor(players, type, rules) {
    this.#players = players;
    this.#type = type;
    this.#rules = rules;
  }

  get players() {
    return this.#players;
  }

  get roundConfig() {
    return this.#roundConfig;
  }

  get type() {
    return this.#type;
  }

  newGame() {

  }

  endTurn() {

  }

  getPoints(player) {
    return this.#points[player];
  }

  newRound() {

  }

  getRules(rule) {

  }
}