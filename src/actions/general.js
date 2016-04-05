import * as types from "../constants/ActionTypes";

export const closeForager = () => {
  return {
    type: types.CLOSE_FORAGER
  };
};

export const openForager = () => {
  return {
    type: types.OPEN_FORAGER
  };
};

export const showMessage = (text, wait) => {
  return {
    type: types.SHOW_MESSAGE,
    text: text,
    wait: wait
  };
};
