import React from "react";
import { render } from "react-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import Forager from "./containers/Forager";
import reducer from './reducers';

import { SHOW_FORAGER } from "./constants/ActionTypes";
import chromeBackground from "./middleware/chromeBackground";
import pageMiddleware from "./middleware/pageMiddleware";

import { chromeSave, chromeLoad } from "./chrome";

/*
 * check if the forager holder exists. If it doesn't, mount the app. If it does,
 * check if the app is hidden. If it is hidden, show it.
 */
let holder = document.querySelector(".forager-holder");
document.body.classList.add("foraging");
if ( !holder ) {
  chromeLoad(pages => {
    /*
     * initialState uses the pages loaded by chrome
     */
    let initialState = {
      show: true,
      selector: undefined,
      page: {
        pages: [undefined, ...pages],
        pageIndex: 0
      },
      frame: {
        name: "selector",
        data: {}
      },
      preview: {
        visible: false
      },
      message: {
        text: "",
        fade: undefined
      }
    };
    let store = applyMiddleware(
        chromeBackground,
        pageMiddleware
      )(createStore)(reducer, initialState);

    /*
     * subscribe to the store and save the pages any time that they change
     */
    let oldPages = {};
    store.subscribe(() => {
      let state = store.getState();
      let pages = state.page.pages;
      if ( pages !== oldPages ) {
        chromeSave(pages);
        oldPages = pages;
      }
    });

    /*
     * actually render Forager
     */
    let holder = document.createElement("div");
    holder.classList.add("forager-holder");
    holder.classList.add("no-select");
    document.body.appendChild(holder);

    render((
      <Provider store={store}>
        <Forager />
      </Provider>
      ), holder
    );

    // window here is the extension's context, so it is not reachable by code
    // outside of the extension.
    window.store = store;

  })
} else {
  document.body.classList.add("foraging");
  let currentState = store.getState();
  if ( !currentState.show ) {
    store.dispatch({
      type: SHOW_FORAGER
    });
  }
}

