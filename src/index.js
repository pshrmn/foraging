import { render } from "react-dom";
import Forager from "./components/Forager";
import React from "react";

// create an element to attach Forager to
let holder = document.createElement("div");
holder.classList.add("forager-holder");
document.body.appendChild(holder);

render((
  <Forager />
), holder
);
