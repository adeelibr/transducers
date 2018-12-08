// Utils
const apply = (x, f) => f(x);

export const compose = (...funcs) => x => funcs.reduceRight(apply, x);

export const concat = (xs, val) => xs.concat(val);
