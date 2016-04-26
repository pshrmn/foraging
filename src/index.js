import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import Forager from "./components/Forager";
import { openForager, setPages } from "./actions";
import { chromeLoad } from "./helpers/chrome";
import makeStore from "./store";

// the foraging class adds a margin to the bottom of the page, which
// is helpful in preventing the app from overlapping content
document.body.classList.add("foraging");

/*
 * check if the forager holder exists. If it doesn't, mount the app. If it does,
 * check if the app is hidden. If it is hidden, show it.
 */
if ( !document.querySelector(".forager-holder") ) {
  // create the element that will hold the app
  const holder = document.createElement("div");
  holder.classList.add("forager-holder");
  document.body.appendChild(holder);

  const store = makeStore();

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
  document.body.classList.add("foraging");
  window.restore();
}

