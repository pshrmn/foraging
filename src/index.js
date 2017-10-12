import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { syncResponses } from '@curi/redux';

import config from 'config';
import store from 'store';

import CuriProvider from 'components/CuriProvider';
import Forager from 'components/Forager';
import { openForager, setPages } from 'actions';
import { load as chromeLoad } from 'helpers/chrome';
import { stripEvents } from 'helpers/attributes';

// the foraging class adds a margin to the bottom of the page, which
// is helpful in preventing the app from overlapping content
{
  document.body.classList.add('foraging');
  stripEvents(document.body);
  Array.from(document.querySelectorAll("*")).forEach(e => { stripEvents(e); });
}

/*
 * check if the forager holder exists. If it doesn't, mount the app. If it does,
 * check if the app is hidden. If it is hidden, show it.
 */
if ( !document.querySelector('.forager-holder') ) {
  // create the element that will hold the app
  const holder = document.createElement('div');
  holder.classList.add('forager-holder');
  document.body.appendChild(holder);

  Promise.all([chromeLoad(), config.ready()])
    .then(([ pages ]) => {

      syncResponses(store, config);
      store.dispatch(setPages(pages));

      ReactDOM.render((
        <Provider store={store}>
          <CuriProvider>
            <Forager />
          </CuriProvider>
        </Provider>
      ), holder);

    });
  // a function to re-show the app if it has been closed
  window.restore = () => {
    if ( !store.getState().show ) {
      store.dispatch(openForager());
    }
  };
} else {
  document.body.classList.add('foraging');
  window.restore();
}

