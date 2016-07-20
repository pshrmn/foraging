import * as types from 'constants/ActionTypes';

export const showElementFrame = () => ({
  type: types.SHOW_ELEMENT_FRAME
});

export const showElementWizard = () => ({
  type: types.SHOW_ELEMENT_WIZARD
});

export const showEditElementWizard = () => ({
  type: types.SHOW_EDIT_ELEMENT_WIZARD
});

export const showRuleWizard = () => ({
  type: types.SHOW_RULE_WIZARD
});

export const showEditRuleWizard = index => ({
  type: types.SHOW_EDIT_RULE_WIZARD,
  index
});

export const showPreview = () => ({
  type: types.SHOW_PREVIEW
});
