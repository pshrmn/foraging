import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@curi/react';

import Element from 'components/Element';
import { NegButton } from 'components/common/Buttons';
import { updatePage } from 'actions';
import { removeElement } from 'helpers/page';

/*
 * An ElementCard is used to display a selector Element and its control functions
 */
function ElementCard(props) {
  const {
    index,
    page,
    element
  } = props;

  //const isRoot = element.index === 0;

  if (!element) {
    return (
      <div className='info-box'>
        <p>Element not found</p>
      </div>
    );
  }

  const params = { name: page.name, index };

  return (
    <div className='info-box'>
      <div className='info'>
        <Element {...element} params={params} />
      </div>
      <div className='buttons'>
        <Link
          to='Add Selector'
          params={params}
          anchor='button'
          className='pos'
        >
          Add Child
        </Link>
        <NegButton
          text='Remove Element'
          click={() => {
            const { page, element, select, updatePage } = props;
            const confirmMessage = element.index === 0
              ? 'Are you sure you want to reset the page? This will delete all rules and child elements'
              : `Are you sure you want to delete the element "${element.selector}"?`;
            const confirmed = window.confirm(confirmMessage);
            if (confirmed) {
              const { newPage, newElementIndex } = removeElement(page, element);
              updatePage(newPage);
              select(newElementIndex);
            }
          }}
        />
        {
          element.index !== 0
            ? <Link
              to='Edit Selector'
              params={params}
              anchor='button'
            >
              Edit
            </Link>
            : null
        }
        <Link
          to='Add Rule'
          params={params}
          anchor='button'
          className='pos'
        >
          Add Rule
        </Link>
      </div>
    </div>
  );
}

ElementCard.propTypes = {
  index: PropTypes.number,
  page: PropTypes.object,
  select: PropTypes.func,
  /* connect */
  updatePage: PropTypes.func,
  element: PropTypes.object
};

export default connect(
  (state, ownProps) => {
    const page = state.page.pages.find(p => p.name === state.response.params.name);
    return {
      element: page.elements[ownProps.index]
    };
  },
  {
    updatePage
  }
)(ElementCard);
