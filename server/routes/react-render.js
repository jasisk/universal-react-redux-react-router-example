import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import createHistory from 'history/lib/createMemoryHistory';
import { root as rootRoute } from '../../common/routes';
import { App } from '../../common/components';
import createStore from '../../common/store';
import { createLocation } from 'history';
import { Provider } from 'react-redux';
import Router from 'react-router';
import React from 'react';

export default function (path, initialData, cb) {


  let location = createLocation(path);
  let history = createHistory({entries: [location]});

  let store = createStore(initialData);

  let elements = [
    <Provider store={store}>
      {() => <Router history={history} routes={rootRoute} />}
    </Provider>
  ];

  if (process.env.NODE_DEVTOOLS) {
    elements.push(
      <DebugPanel top right bottom>
        <DevTools store={store} monitor={LogMonitor} />
      </DebugPanel>
    );
  }

  let html = React.renderToString(<div>{elements}</div>);
  let finalState = store.getState();

  return {html, state: finalState};
}
