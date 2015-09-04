import * as ActionTypes from '../actions/types';
import merge from 'lodash.merge';

export function slideIdx(state = 0, action) {
  switch (action.type) {
  case ActionTypes.SLIDE_CHANGED:
    return action.sid;
  case ActionTypes.SLIDE_INCREMENTED:
    return state + 1;
  default:
    return state;
  }
}

export function connections(state = 0, action) {
  switch (action.type) {
  case ActionTypes.CONNECTION_COUNT_CHANGED:
    return action.count;
  default:
    return state;
  }
}

export function entities(state = { sentiments: {}, slides: [], counts: [] }, action) {
  let entities = action.response && action.response.entities;
  if (entities) {
    return merge({}, state, entities);
  }

  let { slides, sentiments, counts } = state;
  let slide = slides[action.sid];
  let count = slide && counts[action.sid];

  switch (action.type) {
  case ActionTypes.SENTIMENT_REQUESTED:
  case ActionTypes.SENTIMENT_REQUEST_FAILED:
  case ActionTypes.SENTIMENT_REMOVAL_REQUESTED:
  case ActionTypes.SENTIMENT_REMOVAL_REQUEST_FAILED:
  case ActionTypes.SENTIMENT_UPDATED:
    slides = [
      ...slides.slice(0, action.sid),
      slideReducer(slide, action),
      ...slides.slice(action.sid + 1)
    ];
  case ActionTypes.COUNTS_UPDATED:
    counts = [
      ...counts.slice(0, action.sid),
      countReducer(count, action),
      ...counts.slice(action.sid + 1)
    ];
    return {
      slides: slides,
      counts: counts,
      sentiments: sentiments
    };
  default:
    return state;
  };
}

function slideReducer(state = {is: []}, action) {
  let is, idx;
  switch (action.type) {
  case ActionTypes.SENTIMENT_UPDATED:
    is = [ ...action.sentiments ];
    return {...state, is};
  case ActionTypes.SENTIMENT_REMOVAL_REQUEST_FAILED:
  case ActionTypes.SENTIMENT_REQUESTED:
    is = [ ...state.is, action.sentiment ];
    return {...state, is};
  case ActionTypes.SENTIMENT_REQUEST_FAILED:
  case ActionTypes.SENTIMENT_REMOVAL_REQUESTED:
    idx = state.is.indexOf(action.sentiment);
    is = [ ...state.is.slice(0, idx), ...state.is.slice(idx + 1) ];
    return {...state, is};
  default:
    return state;
  }
}

function countReducer(state = {}, action) {
  let count, counts, idx, is;
  switch (action.type) {
  case ActionTypes.SENTIMENT_REMOVAL_REQUEST_FAILED:
  case ActionTypes.SENTIMENT_REQUESTED:
    count = (state[action.sentiment] || 0) + 1;
    counts = { ...state, [action.sentiment]: count };
    return counts;
  case ActionTypes.SENTIMENT_REQUEST_FAILED:
  case ActionTypes.SENTIMENT_REMOVAL_REQUESTED:
    count = (state[action.sentiment] || 1) - 1;
    counts = { ...state, [action.sentiment]: count };
    return counts;
  case ActionTypes.COUNTS_UPDATED:
    return { ...state, ...action.counts };
  default:
    return state;
  }
}
