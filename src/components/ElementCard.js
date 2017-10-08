import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@curi/react';

import Element from 'components/Element';

/*
 * An ElementCard is used to display a selector Element and its control functions
 */
function ElementCard(props) {
  const {
    element,
    active = true,
    name,
    index
  } = props;

  //const isRoot = element.index === 0;

  if (!element) {
    return (
      <div className='info-box'>
        <p>Element not found</p>
      </div>
    );
  }

  return (
    <div className='info-box'>
      <div className='info'>
        <Element active={active} {...element} />
      </div>
      <div className='buttons'>
        <Link
          to='Add Selector'
          params={{ name, index }}
          anchor='button'
        >
          Add Child
        </Link>
      </div>
    </div>
  );
}

ElementCard.propTypes = {
  element: PropTypes.object,
  active: PropTypes.bool,
  name: PropTypes.string,
  index: PropTypes.number
};

export default connect(
  state => {
    const { pages, current, elementIndex } = state.page;
    const page = pages.find(p => p.name === current);
    return {
      element: page ? page.elements[elementIndex] : null,
      name: current,
      index: elementIndex
    };
  }
)(ElementCard);
