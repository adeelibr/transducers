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

// commonality between these 2 functions map/filter above is 'concat'
// used for 'combining' or 'reducing' two things into one.

// generalizing the 'mapping' concept, without the concat
const mapping = func => {
  // this takes in 2 things and makes them 1
  return returnFunction => {
    return (acc, cv) => {
      return returnFunction(acc, func(cv)); // <= returnFunction replaces 'concat'
    };
  };
};

const mapWithRef = mapping(add1);
const mappingResult = nums.reduce(mapWithRef(concat), []);

// console.log('mappingResult ', mappingResult);

// generalizing the 'filtering' concept, without the concat
const filtering = func => {
  // this takes in 2 things and makes them 1
  return returnFunction => {
    return (acc, cv) => {
      return func(cv) ? returnFunction(acc, cv) : acc; // <= returnFunction replaces 'concat'
    };
  };
};

const filterWithRef = filtering(isEven);
const filteringResult = nums.reduce(filterWithRef(concat), []);

// console.log('filteringResult ', filteringResult);

// returnFunction takes in 2 things & returns it into 1
// mapping(fn) returns a function expecting an rf
// filtering(fn) returns a function expecting an rf
// mapping(fn)(rf) returns an rf
// filtering(fn)(rf) returns an rf

// so.. mapping(fn) can recieve as its rf, the returned rf from filtering(p)(rf)
// and vice versa

// these are transducers
// they expect an rf and return an rf
// allowing them to be composed together

// this was the goal
// const transformFilterReduce2 = compose(
//  map(add1), 
//  filter(isEven). 
//  reduce(add)
// );

const transformFilterReduce2 = compose(mapping(add1), filtering(isEven));
const transformFilterReduceResult1 = nums.reduce(
  transformFilterReduce2(concat),
  [],
);

// notice output is [2,4,6,8,10], meaning filtering was applied second
// console.log(transformFilterReduceResult1)

const transformFilterReduceResult2 = nums.reduce(
  transformFilterReduce2(add),
  0,
);

// console.log(transformFilterReduceResult2);

// transduce you'll see in a library...
function transduce(xf, rf, init, xs) {
  // call reduce on the data structure internally (abstract it only)
  // pass the rf to the composed transformation
  // pass in the initial value
  return xs.reduce(xf(rf), init);
}

const transduceResult1 = transduce(transformFilterReduce2, add, 0, nums);

// console.log('transduceResult1', transduceResult1);

// another example, returns an array
const xForm = compose(
  // reminders: these are all transducers
  // compositions of transducers to return a new transducers
  mapping(add1),
  filtering(isEven),
  mapping(doubleIt),
  mapping(add1),
);

const transduceResult2 = transduce(xForm, concat, [], nums);

// console.log('transduceResult2', transduceResult2);

// Continue from 
// https://www.youtube.com/watch?v=SJjOp0X_MVA 30:06 mins