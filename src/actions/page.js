import * as types from 'constants/ActionTypes';

export const selectPage = name => ({
  type: types.SELECT_PAGE,
  name
});

export const addPage = page => ({
  type: types.ADD_PAGE,
  page: page
});

export const removePage = () => ({
  type: types.REMOVE_PAGE
});

export const renamePage = name => ({
  type: types.RENAME_PAGE,
  name: name
});

export const uploadPage = () => ({
  type: types.UPLOAD_PAGE
});

export const syncPages = () => ({
  type: types.SYNC_PAGES
});

export const setPages = pages => ({
  type: types.SET_PAGES,
  pages
});

export const updatePage = page => ({
  type: types.UPDATE_PAGE,
  page
});

// matches is an object where the keys are
// element indices and the values are elements
// that are matched by the element selector with
// the same index
export const setMatches = matches => ({
  type: types.SET_MATCHES,
  matches
});

// trigger the matches to be re-selected
export const refreshMatches = () => ({
  type: types.REFRESH_MATCHES
});

/*
 * ELEMENT/RULE ACTIONS
 */
export const saveRule = rule => ({
  type: types.SAVE_RULE,
  rule
});

export const removeRule = index => ({
  type: types.REMOVE_RULE,
  index
});

export const updateRule = (index, rule) => ({
  type: types.UPDATE_RULE,
  index,
  rule
});
