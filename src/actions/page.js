import * as types from "../constants/ActionTypes";

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
 * ELEMENT/RULE ACTIONS
 */
export const selectElement = index => {
  return {
    type: types.SELECT_ELEMENT,
    index
  };
};

// add a new element selector, using the current element
// selector as its parent
export const saveElement = element => {
  return {
    type: types.SAVE_ELEMENT,
    element: element
  };
};

// rename the currently selected element selector
export const renameElement = name => {
  return {
    type: types.RENAME_ELEMENT,
    name
  };
};

// remove the currently selected element selector
export const removeElement = () => {
  return {
    type: types.REMOVE_ELEMENT
  };
};

// toggle whether the current element selector is optional
export const toggleOptional = () => {
  return {
    type: types.TOGGLE_OPTIONAL
  };
};

export const saveRule = rule => {
  return {
    type: types.SAVE_RULE,
    rule
  };
};

export const removeRule = index => {
  return {
    type: types.REMOVE_RULE,
    index
  };
};
