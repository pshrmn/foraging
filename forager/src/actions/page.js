import * as types from 'constants/ActionTypes';

export const addPage = page => ({
  type: types.ADD_PAGE,
  page: page
});

export const removePage = name => ({
  type: types.REMOVE_PAGE,
  name
});

export const renamePage = (name, oldName) => ({
  type: types.RENAME_PAGE,
  name,
  oldName
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

// trigger the matches to be re-selected
export const refreshMatches = () => ({
  type: types.REFRESH_MATCHES
});
