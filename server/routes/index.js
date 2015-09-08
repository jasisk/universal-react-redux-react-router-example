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
    const error = new Error(`cannot find store with id: ${pid}`);
    error.code = 404;
    next(error);
  });
};

function sentimentRoutes(router) {
  router.post('/sentiment', validateSentiment(), sentiment);

  router.get('/store', (req, res) => res.json(req.store.withReq(req).toObject()));

  router.get('*', (req, res) => {
    const { store, app: { kraken: config } } = req;
    const reqStore = store.withReq(req);

    const {html, state} = reactRender(req.originalUrl, reqStore.toObject());

    res.send(`
<!doctype html>
<html>
  <head>
    <link href="/styles/main.css" rel="stylesheet" type="text/css">
  <body>
    <div id="app">${html}</div>
    <script>
      window.__INITIALSTATE__ = ${JSON.stringify(state)};
    </script>
    <script src="/js/bundle.js"></script>
  </body>
</html>
    `);
  });
};
