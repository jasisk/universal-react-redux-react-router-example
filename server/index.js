import Store, { KEY as storeKey } from './lib/store';
import webpackMiddleware from './middleware/webpack';
import onconfigThunk from './lib/onconfig';
import { Server as WSS } from 'ws';
import kraken from 'kraken-js';
import express from 'express';
import ConnectionGroup, {
  KEY as groupKey,
  defaultLogger as groupLog,
  onConnection
} from './lib/connection-group';

const args = name => `middleware:${name}:module:arguments`;
const app = express();

const opts = onconfigThunk(args('session'))({
  onconfig: function (config, next) {
    const [{ store: sessionStore, name, secret }] = config.get(args('session'));
    const groups = Groups({store: sessionStore, name, secret});
    const sentiments = config.get('sentiments');
    const presentations = config.get('presentations');
    const stores = Object.keys(presentations).reduce((stores, presentation) => {
      stores[presentation] = new Store(presentations[presentation], sentiments, presentation);
      return stores;
    }, {});

    config.set(groupKey, groups);
    config.set(storeKey, stores);

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
    const groups = config.get(groupKey);
    const stores = config.get(storeKey);

    wss.on('connection', onConnection({stores, groups}));

    console.log(`listening on ${listeningOn} ...`);
  });
});

function Groups({store, name, secret}) {
  const groups = {};
  return {
    create(pid) {
      const group = new ConnectionGroup({store, name, secret});
      groupLog(group);
      groups[pid] = group;
      return group;
    },
    get(pid) {
      return groups[pid];
    },
    delete(pid) {
      if (pid in groups) {
        delete groups[pid];
      }
    }
  };
}
