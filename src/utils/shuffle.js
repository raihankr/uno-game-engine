/**
 * Shuffle the given array using Fisher-Yates algoritm.\
 * Returns the shuffled array
 * @param {any[]} array - The array to be shuffled
 * @returns {any[]}
 */
export default function shuffle(array) {
  let shuffledArray = [];

  for (let [index, values] of array.entries()) {
    let randomIndex = Math.round(Math.random() * (array.length - 1 - index)) + index;

    shuffledArray.push(array[randomIndex]);
    array[randomIndex] = values;
  }

  return shuffledArray;
}