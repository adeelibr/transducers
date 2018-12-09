// Utils
const apply = (x, f) => f(x);

/**
 * @param (...funcs) [Array] of functions passed
 * @param x [Current value] in the array
 */
export const compose = (...funcs) => x => {
  return funcs.reduceRight(apply, x);
  // return funcs.reduceRight((accumulator, currentFunction) => {
  //   return currentFunction(accumulator);
  // }, x);
};

export const concat = (xs, val) => xs.concat(val);
