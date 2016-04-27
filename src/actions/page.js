import * as types from "../constants/ActionTypes";

export const selectPage = index => {
  return {
    type: types.SELECT_PAGE,
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

export const syncPages = () => {
  return {
    type: types.SYNC_PAGES
  };
};

export const setPages = pages => {
  return {
    type: types.SET_PAGES,
    pages
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

// update the properties of the element at index
export const updateElement = (index, newProps) => {
  return {
    type: types.UPDATE_ELEMENT,
    index,
    newProps
  };
};

// remove the currently selected element selector
export const removeElement = () => {
  return {
    type: types.REMOVE_ELEMENT
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
