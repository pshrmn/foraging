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
  }
}
