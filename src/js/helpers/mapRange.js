// @ts-check
/**
 * @typedef {Object} Scale
 * @property {number} min
 * @property {number} max
 */

/**
 * @param {Scale} fromRange
 * @param {Scale} toRange
 * @param {number} num
 * @returns {number}
 */
const mapNumBetweenRanges = (fromRange, toRange, num) => {
  /**
   * @type {number}
   */
  const sizeOfToRange = toRange.max - toRange.min;
  /**
   * @type {number}
   */
  const sizeOfFromRange = fromRange.max - fromRange.min;

  return (
    toRange.min + (sizeOfToRange / sizeOfFromRange) * (num - fromRange.min)
  );
};

export default mapNumBetweenRanges;
