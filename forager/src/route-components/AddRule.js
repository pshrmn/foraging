import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { currentPage } from 'helpers/store';
import RuleWizard from 'components/wizards/RuleWizard';

const AddRule = ({ page, element }) => (
  <div className='frame'>
    <RuleWizard page={page} element={element} />
  </div>
);

AddRule.propTypes = {
  page: PropTypes.object,
  element: PropTypes.object
};

export default connect(
  state => {
    const { params } = state.response;
    const { index } = params;
    const page = currentPage(state);
    return {
      element: page.elements[index],
      page
    };
  }
)(AddRule);
