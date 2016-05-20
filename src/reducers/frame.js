import * as types from '../constants/ActionTypes';

/*
 * frame
 * -----
 *
 * Which frame to show. In the majority of cases, the 'element' frame should
 * be shown.
 */
export default function frame(state = {name: 'element'}, action) {
  switch ( action.type ) {
  case types.SELECT_PAGE:
  case types.ADD_PAGE:
  case types.SET_PAGES:
  case types.REMOVE_ELEMENT:
  case types.SAVE_ELEMENT:
  case types.UPDATE_ELEMENT:
  case types.SAVE_RULE:
  case types.REMOVE_RULE:
  case types.UPDATE_RULE:
  case types.CLOSE_FORAGER:
  case types.SHOW_ELEMENT_FRAME:
    return {
      name: 'element'
    };
  case types.SHOW_ELEMENT_WIZARD:
    return {
      name: 'element-wizard'
    };
  case types.SHOW_EDIT_ELEMENT_WIZARD:
    return {
      name: 'edit-element-wizard'
    };
  case types.SHOW_RULE_WIZARD:
    return{
      name: 'rule-wizard'
    };
  case types.SHOW_EDIT_RULE_WIZARD:
    return {
      name: 'edit-rule-wizard'
    };
  case types.SHOW_PREVIEW:
    return {
      name: 'preview'
    };
  default:
    return state;
  }
}
