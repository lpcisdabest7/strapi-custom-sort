/**
 * Reorders a non-contiguous subset of elements in an array to match a new specified order,
 * preserving their original positions in the array.
 *
 * @param array - The original array.
 * @param newSubsetOrder - The subset of elements (from `array`) in the desired new order.
 *
 * @returns A new array with the same structure, where the matched elements are reordered in-place.
 *
 * @throws {Error} If any element in `newSubsetOrder` is not found in `array`.
 *
 * @example
 * const array = ['a', 'b', 'c', 'd', 'e', 'f'];
 * const newSubsetOrder = ['e', 'a', 'c'];
 *
 * // 'a', 'c', and 'e' are in the original array at indices 0, 2, and 4.
 * // After reordering, the elements at those same positions become:
 * // 0 → 'e' (as it is the 1st element in `newSubsetOrder`)
 * // 2 → 'a'
 * // 4 → 'c'
 *
 * const result = reorderSubsetInPlace(array, newSubsetOrder);
 * console.log(result); // ['e', 'b', 'a', 'd', 'c', 'f']
 */
export declare const reorderSubsetInPlace: <T>(array: T[], newSubsetOrder: T[]) => T[];
