import * as Types from '../types';

export function changeSlide(sid) {
  return (dispatch, getState) => {
    const { entities: { slides } } = getState();
    if (slides[sid]) {
      dispatch({
        type: Types.SLIDE_CHANGED,
        sid
      });
    }
  };
}

export function incrementSlide() {
  return (dispatch, getState) => {
    const { slideIdx: idx } = getState();
    dispatch(changeSlide(idx + 1));
  };
}

export function decrementSlide() {
  return (dispatch, getState) => {
    const { slideIdx: idx } = getState();
    dispatch(changeSlide(idx - 1));
  };
}
