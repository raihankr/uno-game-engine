import shuffle from "./shuffle";

let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let array1, array2;

test('array is shuffled', () => {
  array1 = shuffle(array);
  expect(array1).not.toEqual(array);
});

test('array is shuffled again', () => {
  array2 = shuffle(array);
  expect(array2).not.toEqual(array);
  expect(array2).not.toEqual(array1);
});