import React from "react";
import ReactDOM from "react-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import Forager from "./components/Forager";
import reducer from './reducers';

import { SHOW_FORAGER } from "./constants/ActionTypes";
import chromeMiddleware from "./middleware/chromeMiddleware";

import { chromeLoad } from "./helpers/chrome";

/*
 * check if the forager holder exists. If it doesn't, mount the app. If it does,
 * check if the app is hidden. If it is hidden, show it.
 */
const holder = document.querySelector(".forager-holder");
document.body.classList.add("foraging");
if ( !holder ) {
  chromeLoad(pages => {
    /*
     * initialState uses the pages loaded by chrome
     */
    const initialState = {
      show: true,
      element: undefined,
      page: {
        pages: [undefined, ...pages],
        pageIndex: 0
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

    /*
     * actually render Forager
     */
    const holder = document.createElement("div");
    holder.classList.add("forager-holder");
    holder.classList.add("no-select");
    document.body.appendChild(holder);

    ReactDOM.render(
      <Provider store={store}>
        <Forager />
      </Provider>
      , holder
    );

    // window here is the extension's context, so it is not reachable by code
    // outside of the extension. It does, however, need to be accessible when
    // the user click on the browser action button
    window.store = store;

  })
} else {
  // if the app has already been created, dispatch an action to the store
  // to let it know that the app should be visible
  document.body.classList.add("foraging");
  if ( !store.getState().show ) {
    store.dispatch({
      type: SHOW_FORAGER
    });
  }
}

