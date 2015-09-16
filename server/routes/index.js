import validateSentiment from '../middleware/validate-sentiment';
import { KEY as groupKey } from '../lib/connection-group';
import { KEY as storeKey } from '../lib/store';
import reactRender from '../lib/react-render';
import sentiment from './sentiment';
import { Router } from 'express';

const sentimentRouter = new Router();
sentimentRoutes(sentimentRouter);

export default function routes(router) {
  router.use('/presentation/:pid', sentimentRouter);
  router.param('pid', (req, res, next, pid) => {
    const { kraken: config } = req.app;
    const stores = config.get(storeKey);
    const groups = config.get(groupKey);
    if (pid in stores) {
      req.store = stores[pid];
      req.group = groups.get(pid);
      return next();
    }
    // we're unable to handle this route. See if anyone else can.
    next('route');
  });
};

function sentimentRoutes(router) {
  router.post('/sentiment', validateSentiment(), sentiment);
  router.get('/store', (req, res) => res.json(req.store.withReq(req).toObject()));
  router.get('*', reactRender);
};
