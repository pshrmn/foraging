import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { currentPage } from 'helpers/store';
import ElementWizard from 'components/wizards/ElementWizard';

const AddElement = ({ page, element }) => (
  <div className='frame'>
    Add Element
    <ElementWizard page={page} parent={element} />
  </div>
);

AddElement.propTypes = {
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
)(AddElement);
