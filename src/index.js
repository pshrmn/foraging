import React from "react";
import ReactDOM from "react-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import Forager from "./components/Forager";
import reducer from './reducers';

import { openForager } from "./actions";
import chromeMiddleware from "./middleware/chromeMiddleware";

import { chromeLoad } from "./helpers/chrome";

document.body.classList.add("foraging");

/*
 * check if the forager holder exists. If it doesn't, mount the app. If it does,
 * check if the app is hidden. If it is hidden, show it.
 */
if ( !document.querySelector(".forager-holder") ) {
  // create the element that will hold the app
  const holder = document.createElement("div");
  holder.classList.add("forager-holder");
  holder.classList.add("no-select");
  document.body.appendChild(holder);

  chromeLoad()
    .then(pages => {

    const initialState = {
      show: true,
      page: {
        pages: [undefined, ...pages],
        pageIndex: 0,
        elementIndex: 0
      },
      frame: {
        name: "element",
        data: {}
      },
      preview: {
        visible: false
      },
      message: {
        text: "",
        wait: undefined
      }
    };

    const store = createStore(
      reducer,
      initialState,
      applyMiddleware(
        chromeMiddleware
      )
    );

    ReactDOM.render(
      <Provider store={store}>
        <Forager />
      </Provider>
      , holder
    );

    // a function to re-show the app if it has been closed
    window.restore = () => {
      if ( !store.getState().show ) {
        store.dispatch(openForager());
      }
    }
  });
} else {
  document.body.classList.add("foraging");
  window.restore();
}

