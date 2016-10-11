import React from 'react';
import { connect } from 'react-redux';

import ElementFrame from './ElementFrame';
import ElementWizard from './ElementWizard';
import EditElementWizard from './EditElementWizard';
import RuleWizard from './RuleWizard';
import EditRuleWizard from './EditRuleWizard';
import Preview from './Preview';

/*
 * Frames
 * ------
 *
 * The main way for a user to interact with Forager is through the Frames. There
 * are a number of different frames associated with different states of viewing
 * and creating elements.
 *
 */
 const Frames = ({frame}) => {
  switch ( frame.name ) {
  case 'element':
    return <ElementFrame />;
  case 'element-wizard':
    return <ElementWizard />;
  case 'edit-element-wizard':
    return <EditElementWizard />;
  case 'rule-wizard':
    return <RuleWizard />;
  case 'edit-rule-wizard':
    return <EditRuleWizard />;
  case 'preview':
    return <Preview />;
  default:
    return null;
  }
}

export default connect(
  state => ({
    frame: state.frame
  })
)(Frames);
