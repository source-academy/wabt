import { isEqual } from 'lodash';

export function areUint8ArraysEqual(a: Uint8Array, b: Uint8Array) {
  try {
    return isEqual([...a], [...b]);
  } catch (_) {
    return undefined;
  }
}

// console.log(
//   areUint8ArraysEqual(
//     Uint8Array.from([1, 2, 3, 4]),
//     Uint8Array.from([1, 2, 3, 4, 6]),
//   ),
// );
