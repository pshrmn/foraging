import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { currentPage } from 'helpers/store';
import EditElementWizard from 'components/wizards/EditElementWizard';

const EditSelector = ({ page, element }) => (
  <div className='frame'>
    Edit Selector
    <EditElementWizard page={page} element={element} />
  </div>
);

EditSelector.propTypes = {
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
)(EditSelector);
