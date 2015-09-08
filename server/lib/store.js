function initStore(slideCount, sentiments, presentationIdx) {
  let keys = Object.keys(sentiments);
  return {
    entities: {
      counts: Array.apply(null, Array(slideCount)).map(() => ({})),
      sentiments: Object.keys(sentiments).reduce((store, sentiment) => {
        let text = sentiments[sentiment];
        store[sentiment] = {
          id: sentiment,
          text
        }
        return store;
      }, {}),
      slides: Array.apply(null, Array(slideCount)).map(() => ({ is: [] }))
    },
    slideIdx: 0,
    presentationIdx: presentationIdx
  };
}

function initSession(session) {
  session.sentiments = session.sentiments || [];
}

export class ReqStore {
  constructor(req, store) {
    this.Store = store;
    this.req = req;
    initSession(req.session);
  }

  toObject() {
    let StoreObject = this.Store.toObject();
    let sentiments = this.req.session.sentiments;
    let count = this.Store.slideCount;

    let slides = [];
    while (count--) {
      if (StoreObject.entities.slides[count] !== undefined || sentiments[count] !== undefined) {
        slides[count] = Object.assign({}, StoreObject.entities.slides[count], sentiments[count]);
      }
    }

    return { ...StoreObject, entities: { ...StoreObject.entities, slides } };
  }

  addSentiment(sid, sentiment) {
    return changeSentiment(true, sid, sentiment);
  }

  removeSentiment(sid, sentiment) {
    return changeSentiment(false, sid, sentiment);
  }

  changeSentiment(add, sid, sentiment) {
    if (!(this.Store.validateSentiment(sentiment) && this.Store.validateSid(sid))) {
      return false;
    }
    let sentiments = this.getSentimentsBySid(sid);
    if (add) {
      if (includes(sentiments, sentiment)) {
        return false;
      }
      sentiments.push(sentiment);
      this.Store.incrementSlideSentiment(sid, sentiment);
    } else {
      let idx;
      if (!~(idx = sentiments.indexOf(sentiment))) {
        return false;
      }
      sentiments.splice(idx, 1);
      this.Store.decrementSlideSentiment(sid, sentiment);
    }
    return true;
  }

  getSentimentsBySid(sid) {
    if (!(this.Store.validateSid(sid))) {
      return false;
    }
    let { req: { session: { sentiments } } } = this;
    sentiments = sentiments[sid] || (sentiments[sid] = {});
    return sentiments.is = sentiments.is || (sentiments.is = []);
  }
}

export default class Store {
  constructor(slideCount, sentiments, presentationIdx) {
    this.slideCount = slideCount;
    this.sentiments = Object.keys(sentiments);
    this.store = initStore(slideCount, sentiments, presentationIdx);
  }

  toObject() {
    return { ...this.store, entities: { ...this.store.entities } };
  }

  withReq(req) {
    return new ReqStore(req, this);
  }

  changeSlideSentiment(sid, sentiment, by) {
    let value;
    let {
      store: { entities: { counts } }
    } = this;
    if (this.validateSid(sid) && this.validateSentiment(sentiment)) {
      counts = this.getCountsBySid(sid);
      value = (counts[sentiment] || 0) + (by);
      if (value >=0) { return counts[sentiment] = value; }
    }
    return false;
  }

  incrementSlideSentiment(sid, sentiment) {
    return this.changeSlideSentiment(sid, sentiment, 1);
  }

  decrementSlideSentiment(sid, sentiment) {
    return this.changeSlideSentiment(sid, sentiment, -1);
  }

  getCountsBySid(sid) {
    if (!(this.validateSid(sid))) {
      return false;
    }

    let { store: { entities: { counts } } } = this;
    return counts[sid] = counts[sid] || {};
  }

  validateSid(sid) {
    return sid >=0 && sid < this.slideCount;
  }

  validateSentiment(sentiment) {
    return !!~this.sentiments.indexOf(sentiment);
  }
}

function includes(array, value) {
  return !!~array.indexOf(value);
}

export const KEY = '@@STORE';
