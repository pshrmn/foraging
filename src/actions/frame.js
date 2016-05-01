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

export const showEditElementWizard = () => {
  return {
    type: types.SHOW_EDIT_ELEMENT_WIZARD
  };
};


export const showRuleWizard = () => {
  return {
    type: types.SHOW_RULE_WIZARD
  };
};

export const showEditRuleWizard = index => {
  return {
    type: types.SHOW_EDIT_RULE_WIZARD,
    index
  };
};

export const showPreview = () => {
  return {
    type: types.SHOW_PREVIEW
  };
};
