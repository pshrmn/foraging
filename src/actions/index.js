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

export const uploadPage = () => {
  return {
    type: types.UPLOAD_PAGE
  };
};


export const showPreview = () => {
  return {
    type: types.SHOW_PREVIEW
  };
};

export const hidePreview = () => {
  return {
    type: types.HIDE_PREVIEW
  };
};

/*
 * FRAME ACTIONS
 */

export const showSelectorFrame = () => {
  return {
    type: types.SHOW_SELECTOR_FRAME
  };
};

export const showRuleFrame = selector => {
  return {
    type: types.SHOW_RULE_FRAME,
    selector: selector
  };
};

export const showElementFrame = () => {
  return {
    type: types.SHOW_ELEMENT_FRAME
  };
};

export const showPartsFrame = parts => {
  return {
    type: types.SHOW_PARTS_FRAME,
    parts: parts
  };
};

export const showSpecFrame = css => {
  return {
    type: types.SHOW_SPEC_FRAME,
    css: css
  };
};

/*
 * GENERAL ACTIONS
 */
export const closeForager = () => {
  return {
    type: types.CLOSE_FORAGER
  };
};

/*
 * SELECTOR/RULE ACTIONS
 */

export const selectSelector = selector => {
  return {
    type: types.SELECT_SELECTOR,
    selector: selector
  };
};

export const saveSelector = selector => {
  return {
    type: types.SAVE_SELECTOR,
    selector: selector
  };
};

export const removeSelector = () => {
  return {
    type: types.REMOVE_SELECTOR
  };
};

export const saveRule = rule => {
  return {
    type: types.SAVE_RULE,
    rule: rule
  };
};

export const removeRule = index => {
  return {
    type: types.REMOVE_RULE,
    index: index
  };
};
