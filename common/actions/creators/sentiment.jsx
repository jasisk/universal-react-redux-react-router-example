import fetch from 'isomorphic-fetch';
import * as Types from '../types';

export const addSentiment = sentimentThunk(true);
export const removeSentiment = sentimentThunk(false);

function includes(arr, obj) {
  return !!~arr.indexOf(obj);
}

function sentimentThunk(add) {
  let events;

  if (add) {
    events = [
      'SENTIMENT_REQUESTED',
      'SENTIMENT_REQUEST_SUCCEEDED',
      'SENTIMENT_REQUEST_FAILED',
      'INVALID_SENTIMENT_REQUESTED'
    ];
  } else {
    events = [
      'SENTIMENT_REMOVAL_REQUESTED',
      'SENTIMENT_REMOVAL_REQUEST_SUCCEEDED',
      'SENTIMENT_REMOVAL_REQUEST_FAILED',
      'INVALID_SENTIMENT_REMOVAL_REQUESTED'
    ];
  }

  return (sentiment) => (dispatch, getState) => {
    const [REQUESTED, SUCCEEDED, FAILED, INVALID] = events;
    const { entities: { slides, sentiments }, slideIdx: sid } = getState();
    let slide = slides[sid];
    let keys = Object.keys(sentiments);

    if (!includes(keys, sentiment)) {
      dispatch({
        type: INVALID,
        sentiment,
        sid
      });
      return;
    }


    if (slide && (includes(slide.is, sentiment) === !add)) {
      dispatch({
        type: REQUESTED,
        sentiment,
        sid
      });

      //let request = Promise.resolve({ status: 200 });
      let request = fetch('/sentiment', {
        headers: {
          'content-type': 'application/json'
        },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({
          type: REQUESTED,
          sentiment,
          sid
        })
      });
      // let request = new Promise((_, reject) => setTimeout(reject, 1000));

      let checkStatus = response => {
        if (response.status < 200 || response.status >=300) {
          let error = new Error(response.status);
          error.response = response;
          throw error;
        }
        return response;
      };

      request
      .then(checkStatus)
      .then(response => {
        dispatch({
          type: SUCCEEDED,
          sentiment,
          sid
        });
      })
      .catch(error => {
        dispatch({
          type: FAILED,
          sentiment,
          sid
        });
      });
    }
  };
}