import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@curi/react';

import RuleList from './RuleList';
import { NegButton } from 'components/common/Buttons';
import { updatePage } from 'actions';
import { removeElement } from 'helpers/page';
import { describeSpec } from 'helpers/text';

/*
 * An ElementCard is used to display a selector Element and its control functions
 */
function ElementCard(props) {
  const {
    index,
    page,
    element
  } = props;

  const isRoot = element.index === 0;

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
        <div className='element'>
          <div>
            <span className='big bold'>{element.selector}</span>
          </div>
          <div>
            {describeSpec(element.spec)} {element.optional ? <span>(optional)</span> : null}
          </div>
          <RuleList rules={element.rules} params={params} />
        </div>
      </div>
      <div className='buttons'>
        <Link
          to='Add Element'
          params={params}
          anchor='button'
          className='pos'
          title='Add a child element to this element'
        >
          +Child
        </Link>
        <Link
          to='Add Rule'
          params={params}
          anchor='button'
          className='pos'
          title='Add a rule to capture attribute/text values for this element'
        >
          +Rule
        </Link>
        <Link
          to='Edit Element'
          params={params}
          anchor='button'
          title="Edit this element's selector rules"
          disabled={isRoot}
        >
          Edit
        </Link>
        <NegButton
          text={isRoot ? 'Reset Element' : 'Remove Element'}
          click={() => {
            const { page, element, select, updatePage } = props;
            const confirmMessage = isRoot === 0
              ? 'Are you sure you want to reset the page? This will delete all rules and child elements'
              : `Are you sure you want to delete the element "${element.selector}"? This will also delete any child elements.`;
            const confirmed = window.confirm(confirmMessage);
            if (confirmed) {
              const { newPage, newElementIndex } = removeElement(page, element);
              updatePage(newPage);
              select(newElementIndex);
            }
          }}
        />
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
    const page = state.pages.find(p => p.name === state.response.params.name);
    return {
      element: page.elements[ownProps.index]
    };
  },
  {
    updatePage
  }
)(ElementCard);
