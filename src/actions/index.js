import * as types from "../constants/ActionTypes";

/*
 * PAGE ACTIONS
 */
export const loadPage = (index, element) => {
  return {
    type: types.LOAD_PAGE,
    index: index,
    element: element
  };
};

export const addPage = name => {
  return {
    type: types.ADD_PAGE,
    name: name
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

export const showMessage = (text, fade) => {
  return {
    type: types.SHOW_MESSAGE,
    text: text,
    fade: fade
  };
};

/*
 * FRAME ACTIONS
 */

export const showElementFrame = () => {
  return {
    type: types.SHOW_ELEMENT_FRAME
  };
};

export const showRuleFrame = element => {
  return {
    type: types.SHOW_RULE_FRAME,
    element: element
  };
};

export const showHTMLFrame = () => {
  return {
    type: types.SHOW_HTML_FRAME
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
 * ELEMENT/RULE ACTIONS
 */
export const selectElement = element => {
  return {
    type: types.SELECT_ELEMENT,
    element: element
  };
};

export const saveElement = element => {
  return {
    type: types.SAVE_ELEMENT,
    element: element
  };
};

export const renameElement =  () => {
  return {
    type: types.RENAME_ELEMENT
  };
};

export const removeElement = () => {
  return {
    type: types.REMOVE_ELEMENT
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
