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
  case types.SELECT_PAGE:
  case types.SET_PAGES:
  case types.REMOVE_ELEMENT:
  case types.SAVE_ELEMENT:
  case types.SAVE_RULE:
  case types.REMOVE_RULE:
  case types.CLOSE_FORAGER:
  case types.SHOW_ELEMENT_FRAME:
    return Object.assign({}, state, {
      name: "element"
    });
  case types.SHOW_ELEMENT_WIZARD:
    return Object.assign({}, state, {
      name: "element-wizard"
    })
  case types.SHOW_RULE_WIZARD:
    return Object.assign({}, state, {
      name: "rule-wizard"
    });
  default:
    return state;
  }
}
