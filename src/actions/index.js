import * as types from "../constants/ActionTypes";

/*
 * PAGE ACTIONS
 */
export const loadPage = index => {
  return {
    type: types.LOAD_PAGE,
    index: index
  };
};

export const addPage = page => {
  return {
    type: types.ADD_PAGE,
    page: page
  };
};

export const removePage = () => {
  return {
    type: types.REMOVE_PAGE
  };
};

export const renamePage = name => {
  return {
    type: types.RENAME_PAGE,
    name: name
  };
};

/*
 * SELECTOR ACTIONS
 */

export const showSelectorFrame = () => {
  return {
    type: types.SHOW_SELECTOR_FRAME
  };
};

export const showRuleFrame = () => {
  return {
    type: types.SHOW_RULE_FRAME
  }
}

/*
 * GENERAL ACTIONS
 */
export const closeForager = () => {
  return {
    type: types.CLOSE_FORAGER
  };
};
