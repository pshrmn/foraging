import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { currentPage } from 'helpers/store';
import RuleWizard from 'components/wizards/RuleWizard';

const AddSelector = ({ page, element }) => (
  <div className='frame'>
    Add Selector
    <RuleWizard page={page} element={element} />
  </div>
);

AddSelector.propTypes = {
  page: PropTypes.object,
  element: PropTypes.object
};

export default connect(
  state => {
    const { params } = state.response;
    const index = parseInt(params.index);
    const page = currentPage(state);
    return {
      element: page.elements[index],
      page
    };
  }
)(AddSelector);
