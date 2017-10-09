import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ElementWizard from 'components/wizards/ElementWizard';

const AddSelector = () => (
  <div className='frame'>
    Add Selector
    <ElementWizard />
  </div>
);

AddSelector.propTypes = {
  element: PropTypes.object
};

export default connect(
  state => {
    const { pages, current, elementIndex } = state.page;
    const page = pages.find(p => p.name === current);
    return {
      element: page.elements[elementIndex]
    };
  }
)(AddSelector);
