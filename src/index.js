import React from "react";
import { render } from "react-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import Forager from "./containers/Forager";
import reducer from './reducers';

//import { SetupStorage } from "./helpers";
let store = createStore(reducer, {
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
