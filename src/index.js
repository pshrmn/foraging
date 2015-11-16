import React from "react";
import { render } from "react-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import Forager from "./containers/Forager";
import reducer from './reducers';


import { SHOW_FORAGER } from "./constants/ActionTypes";

/*
 * check if the forager holder exists. If it doesn't, mount the app. If it does,
 * check if the app is hidden. If it is hidden, show it.
 */
let holder = document.querySelector(".forager-holder");
if ( !holder ) {
  let store = createStore(reducer, {
    show: true,
    pages: [
      undefined,
      {
      name: "example 1",
      selector: "body",
      spec: {
        type: "single",
        value: 0
      },
      children: [],
      rules: [{
        name: "test",
        attr: "text",
        type: "string"
      }]
    },
    {
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
  });
  // create an element to attach Forager to
  let holder = document.createElement("div");
  holder.classList.add("forager-holder");
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

