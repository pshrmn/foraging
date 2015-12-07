import * as types from "../constants/ActionTypes";

/*
 * frame
 * -----
 *
 * Which frame to show. In the majority of cases, the "element" frame should
 * be shown.
 */
export default function frame(state = "", action) {
  switch ( action.type ) {
  case types.LOAD_PAGE:
  case types.REMOVE_ELEMENT:
  case types.SAVE_ELEMENT:
  case types.SAVE_RULE:
  case types.REMOVE_RULE:
  case types.CLOSE_FORAGER:
  case types.SHOW_ELEMENT_FRAME:
    return Object.assign({}, state, {
      name: "element",
      data: {}
    });
  case types.SHOW_RULE_FRAME:
    return Object.assign({}, state, {
      name: "rule",
      data: {}
    });
  case types.SHOW_HTML_FRAME:
    return Object.assign({}, state, {
      name: "html",
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
