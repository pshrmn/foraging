import * as types from "../constants/ActionTypes";

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
