import * as types from "../constants/ActionTypes";

export default function frame(state = "", action) {
  switch ( action.type ) {
  case types.LOAD_PAGE:
    return Object.assign({}, state, {
      name: "selector",
      data: {}
    });
  case types.SHOW_SELECTOR_FRAME:
    return Object.assign({}, state, {
      name: "selector",
      data: {}
    });
  case types.SHOW_RULE_FRAME:
    return Object.assign({}, state, {
      name: "rule",
      data: {}
    });
  case types.SHOW_ELEMENT_FRAME:
    return Object.assign({}, state, {
      name: "element",
      data: {}
    });
  case types.SHOW_PARTS_FRAME:
    return Object.assign({}, state, {
      name: "parts",
      data: {
        parts: action.parts
      }
    });
  case types.SHOW_SPEC_FRAME:
    return Object.assign({}, state, {
      name: "spec",
      data: {
        css: action.css
      }
    });
  default:
    return state;
  }
}
