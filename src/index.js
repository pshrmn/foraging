import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import Forager from './components/Forager';
import { openForager, setPages } from './actions';
import { load as chromeLoad } from './helpers/chrome';
import { stripEvents } from './helpers/attributes';
import makeStore from './store';

// the foraging class adds a margin to the bottom of the page, which
// is helpful in preventing the app from overlapping content
{
  document.body.classList.add('foraging');
  stripEvents(document.body);
  Array.from(document.querySelectorAll("*")).forEach(e => { stripEvents(e)});
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

  const store = makeStore();

  // remove any event (on*) attributes on load

  chromeLoad()
    .then(pages => {
      store.dispatch(
        setPages(pages)
      );
      ReactDOM.render(
        <Provider store={store}>
          <Forager />
        </Provider>
        , holder
      );

    });
  // a function to re-show the app if it has been closed
  window.restore = () => {
    if ( !store.getState().show ) {
      store.dispatch(openForager());
    }
  }
} else {
  document.body.classList.add('foraging');
  window.restore();
}

