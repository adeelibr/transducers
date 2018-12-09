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

// console.log('Add Payload 1:', mapResult1);
// console.log('Add Payload 2:', mapResult2);

const filterResult1 = nums.filter(isEven).filter(isOdd);

const excludeAll = x => isEven(x) && isOdd(x);
const filterResult2 = nums.filter(excludeAll);

// console.log('Filter 1:', filterResult1);
// console.log('Filter 2:', filterResult2);

const result1 = nums // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  .map(add1) // [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  .filter(isEven) // [2, 4, 6, 8, 10]
  .reduce(add, 0); // 30

const transformFilterReduce1 = compose(add, isEven, add1);
const result2 = nums.map(transformFilterReduce1);

// console.log('Result 1:', result1);
// console.log('Result 2:', result2);

// Something like this is the goal
// const transformFilterReduce2 = compose(reduce(add), filter(isEven), map(add1));
// transformFilterReduce2(nums);

const mapWithReduce1 = (array, func) => {
  return array.reduce((acc, val) => {
    return concat(acc, func(val));
  }, []);
};

const mapWithReduceResult1 = mapWithReduce1(nums, add1);

// console.log('mapWithReduceResult1 ', mapWithReduceResult1);

const mapWithReduce2 = func => {
  return (acc, val) => {
    return concat(acc, func(val));
  };
};

const mapWithReduceResult2 = nums.reduce(mapWithReduce2(add1), []);

// console.log('mapWithReduceResult2 ', mapWithReduceResult2)

const filterWithReduce1 = (array, func) => {
  return array.reduce((acc, val) => {
    return func(val) ? concat(acc, val) : acc;
  }, []);
};

const filterWithReduceResult1 = filterWithReduce1(nums, isEven);

// console.log('filterWithReduceResult1 ', filterWithReduceResult1);

const filterWithReduce2 = func => {
  return (acc, val) => {
    return func(val) ? concat(acc, val) : acc;
  };
};

const filterWithReduceResult2 = nums.reduce(filterWithReduce2(isEven), []);
// console.log('filterWithReduceResult2 ', filterWithReduceResult2);