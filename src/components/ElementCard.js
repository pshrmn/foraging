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
    element,
    page,
    active = true
  } = props;

  //const isRoot = element.index === 0;

  if (!element) {
    return (
      <div className='info-box'>
        <p>Element not found</p>
      </div>
    );
  }

  const params = { name: page.name, index: element.index };

  return (
    <div className='info-box'>
      <div className='info'>
        <Element active={active} {...element} />
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
  element: PropTypes.object,
  page: PropTypes.object,
  active: PropTypes.bool,
  select: PropTypes.func,
  /* connect */
  updatePage: PropTypes.func,
};

export default connect(
  null,
  {
    updatePage
  }
)(ElementCard);
