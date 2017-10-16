import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { currentPage } from 'helpers/store';
import EditRuleWizard from 'components/wizards/EditRuleWizard';

const EditRule = ({ page, element, rule, ruleIndex }) => (
  <div className='frame'>
    Edit Rule
    <EditRuleWizard page={page} element={element} rule={rule} ruleIndex={ruleIndex} />
  </div>
);

EditRule.propTypes = {
  page: PropTypes.object,
  element: PropTypes.object,
  rule: PropTypes.object,
  ruleIndex: PropTypes.number
};

export default connect(
  state => {
    const { params } = state.response;
    const { index, ruleIndex } = params;
    const page = currentPage(state);
    const element = page.elements[index];
    return {
      element,
      page,
      rule: element.rules[ruleIndex],
      ruleIndex
    };
  }
)(EditRule);
