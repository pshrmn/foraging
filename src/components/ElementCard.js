import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@curi/react';

import Element from 'components/Element';
import { NegButton } from 'components/common/Buttons';


/*
 * An ElementCard is used to display a selector Element and its control functions
 */
function ElementCard(props) {
  const {
    element,
    active = true,
    params: { name },
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
        <NegButton
          text='Remove Element'
          click={() => {
            /* eslint-disable */
            console.log('Removing element is not enabled');
          }}
        />
      </div>
    </div>
  );
}

ElementCard.propTypes = {
  params: PropTypes.object,
  index: PropTypes.number,
  element: PropTypes.object,
  active: PropTypes.bool
};

export default connect(
  (state, ownProps) => {
    const { params, index } = ownProps;
    const { pages } = state.page;
    const page = pages.find(p => p.name === params.name);
    return {
      element: page ? page.elements[index] : null
    };
  }
)(ElementCard);
