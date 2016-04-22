import * as types from "../constants/ActionTypes";

export const showElementFrame = () => {
  return {
    type: types.SHOW_ELEMENT_FRAME
  };
};

export const showElementWizard = () => {
  return {
    type: types.SHOW_ELEMENT_WIZARD
  };
};

export const showRuleFrame = element => {
  return {
    type: types.SHOW_RULE_FRAME,
    element: element
  };
};
