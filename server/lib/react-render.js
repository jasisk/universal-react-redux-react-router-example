import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { root as routes } from '../../common/routes';
import { RoutingContext, match } from 'react-router';
import createStore from '../../common/store';
import { createLocation } from 'history';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/server';
import React from 'react';

export default function (req, res, next) {
  const { originalUrl: path, store } = req;
  const initialData = store.withReq(req).toObject();
  const location = createLocation(path);

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      return res.redirect(301, redirectLocation.pathname + redirectLocation.search);
    }
    if (error) {
      return next(error);
    }
    if (renderProps === null) {
      // ¯\_(ツ)_/¯ no route found - move along
      return next('route');
    }

    let store = createStore(initialData);
    let elements = [
      <Provider store={store}>
        <RoutingContext {...renderProps} />
      </Provider>
    ];

    if (process.env.NODE_DEVTOOLS) {
      elements.push(
        <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
      );
    }

    const markup = ReactDOM.renderToString(<div>{elements}</div>);
    const state = store.getState();

    res.send(render({markup, state}));
  });
}

function render({markup, state}) {
  return `
<!doctype html>
<html>
  <head>
    <link href="/styles/main.css" rel="stylesheet" type="text/css">
  <body>
    <div id="app">${markup}</div>
    <script>
      window.__INITIALSTATE__ = ${JSON.stringify(state)};
    </script>
    <script src="/js/bundle.js"></script>
  </body>
</html>
  `;
}
