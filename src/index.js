import { compose, concat } from './fp';

// input payload
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// transformations (changes array)
const add1 = x => x + 1;
const doubleIt = x => x + 2;
const add = (x, y) => x + y;

// predicates (filters arrays)
const isEven = x => x % 2 === 0;
const isOdd = x => !isEven(x);

const mapResult1 = nums
  .map(add1)
  .map(add1)
  .map(add1)
  .map(add1)
  .map(doubleIt);

const transform = compose(doubleIt, add1, add1, add1, add1);
const mapResult2 = nums.map(transform);

console.log('Payload 1', mapResult1)
console.log('Payload 2', mapResult2)