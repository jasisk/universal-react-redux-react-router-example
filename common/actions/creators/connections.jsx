import * as Types from '../types';

export function updateCounts(count) {
  return {
    type: Types.CONNECTION_COUNT_CHANGED,
    count
  };
}
