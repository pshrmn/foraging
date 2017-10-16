import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { currentPage } from 'helpers/store';
import ElementWizard from 'components/wizards/ElementWizard';

const AddSelector = ({ page, element }) => (
  <div className='frame'>
    Add Selector
    <ElementWizard page={page} parent={element} />
  </div>
);

AddSelector.propTypes = {
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
)(AddSelector);
