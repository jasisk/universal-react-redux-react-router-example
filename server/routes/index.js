import { KEY as storeKey } from '../lib/store';
import reactRender from './react-render';
import sentiment from './sentiment';

export default function routes(router) {
  router.post('/sentiment', sentiment);

  router.get('*', (req, res) => {
    const { app: { kraken: config } } = req;
    const store = config.get(storeKey);
    const reqStore = store.withReq(req);

    const {html, state} = reactRender(req.path, reqStore.toObject()); 

    res.send(`
<!doctype html>
<html>
  <body>
    <div id="app">${html}</div>
    <script>
      window.__INITIALSTATE__ = ${JSON.stringify(state)};
    </script>
    <script src="js/bundle.js"></script>
  </body>
</html>
    `);
  });
};
