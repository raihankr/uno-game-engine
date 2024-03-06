class Game {
  #players = [];
  #points = new Map();

  constructor(players) {
    this.#players = players;
  }

  newGame() {

  }

  put(players, card) {

  }

  draw(players, amount) {

  }

  endTurn() {

  }

  getPoints(player) {
    return this.#points[player];
  }

  get players() {
    return this.#players;
  }
}