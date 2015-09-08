import Store, { KEY as storeKey } from './lib/store';
import webpackMiddleware from './middleware/webpack';
import onconfigThunk from './lib/onconfig';
import { Server as WSS } from 'ws';
import kraken from 'kraken-js';
import express from 'express';
import ConnectionGroup, {
  KEY as groupKey,
  defaultLogger as groupLog
} from './lib/connection-group';

const args = name => `middleware:${name}:module:arguments`;
const app = express();

const opts = onconfigThunk(args('session'))({
  onconfig: function (config, next) {
    const [{ store: sessionStore, name, secret }] = config.get(args('session'));
    const group = new ConnectionGroup({store: sessionStore, name, secret});
    const sentiments = config.get('sentiments');
    const presentations = config.get('presentations');
    const stores = Object.keys(presentations).reduce((stores, presentation) => {
      console.log('adding store for', presentation);
      stores[presentation] = new Store(presentations[presentation], sentiments, presentation);
      return stores;
    }, {});

    config.set(groupKey, group);
    config.set(storeKey, stores);

    groupLog(group);

    function connectionCount() {
      let size = group.size;
//      store.store.connections = size;
      group.send({
        type: 'CONNECTION_COUNT_CHANGED',
        count: size
      });
    }

    group.on('add', () => group.once('change', connectionCount));
    group.on('delete', connectionCount);

    next(null, config);
  }
});

app.use(kraken(opts));

app.on('start', function onStart() {
  const { kraken: config } = app;
  const PORT = config.get('PORT');

  app.listen(PORT).on('listening', function onListening() {
    const server = this;
    const wss = new WSS({ server });
    const listeningOn = server.address().port || server.address();
    const group = config.get(groupKey);

    wss.on('connection', group.onConnection());

    console.log(`listening on ${listeningOn} ...`);
  });
});
