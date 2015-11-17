import React from "react";
import { render } from "react-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import Forager from "./containers/Forager";
import reducer from './reducers';


import { SHOW_FORAGER } from "./constants/ActionTypes";
import { findSelector } from "./middleware/findSelector";
import { pageElements } from "./helpers";

/*
 * check if the forager holder exists. If it doesn't, mount the app. If it does,
 * check if the app is hidden. If it is hidden, show it.
 */
let holder = document.querySelector(".forager-holder");
if ( !holder ) {
  let initialState = {
    show: true,
    selector: undefined,
    page: {
      pages: [
        undefined,
        {
        id: 0,
        name: "example 1",
        selector: "body",
        spec: {
          type: "single",
          value: 0
        },
        children: [
          {
            id: 1,
            selector: "div",
            spec: {
              type: "all",
              value: "divs"
            },
            children: [],
            rules: []
          }
        ],
        rules: [{
          name: "test",
          attr: "text",
          type: "string"
        }]
      },
      {
        id: 0,
        name: "example 2",
        selector: "body",
        spec: {
          type: "single",
          value: 0
        },
        children: [],
        rules: []
      }],
      pageIndex: 0
    },
    frame: {
      name: "selector",
      data: {}
    }
  };
  initialState.page.pages.forEach(p => {
    pageElements(p);
  });
  let store = applyMiddleware(
      findSelector
    )(createStore)(reducer, initialState);
  // create an element to attach Forager to
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

  window.store = store;
} else {
  let currentState = store.getState();
  if ( !currentState.show ) {
    store.dispatch({
      type: SHOW_FORAGER
    });
  }
}

