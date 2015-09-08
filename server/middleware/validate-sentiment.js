import {
  SENTIMENT_REMOVAL_REQUESTED,
  SENTIMENT_REQUESTED,
  SENTIMENT_UPDATED,
  COUNTS_UPDATED
} from '../../common/actions/types';

export default function () {

  return (req, res, next) => {
    if (req.method !== 'POST') { return next(); }

    const {
      sessionID,
      body: { sentiment, type, sid },
      app: { kraken: config },
      store,
      group
    } = req;

    const reqStore = store.withReq(req);

    const validTypes = [SENTIMENT_REQUESTED, SENTIMENT_REMOVAL_REQUESTED];

    // validate sentiment
    if (!(store.validateSentiment(sentiment))) {
      return next(error('invalid sentiment'));
    }

    // validate type
    if (!(~validTypes.indexOf(type))) {
      return next(error('invalid type'));
    }

    // validate sid
    if (!(store.validateSid(sid))) {
      return next(error('invalid sid'));
    }

    // other validations
    const toAdd = type === SENTIMENT_REQUESTED;

    const hasChanged = reqStore.changeSentiment(toAdd, sid, sentiment);

    if (hasChanged === false) {
      return next(error(`cannot ${toAdd ? 'add' : 'remove'} sentiment`));
    }

    group.getSession(sessionID).send({
      type: SENTIMENT_UPDATED,
      sentiments: reqStore.getSentimentsBySid(sid),
      sid
    });

    group.send({
      type: COUNTS_UPDATED,
      counts: { [sentiment]: store.getCountsBySid(sid)[sentiment] },
      sid
    });

    next();
  };
}

function error(text, code=422) {
  let err = new Error(text);
  err.status = code;
  return err;
}
