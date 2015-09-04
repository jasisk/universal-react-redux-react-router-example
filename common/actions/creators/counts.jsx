import * as Types from '../types';

export function updateCounts(sid, counts) {
  return {
    type: Types.COUNTS_UPDATED,
    sid,
    counts
  };
}
