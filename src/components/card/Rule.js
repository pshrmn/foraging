import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@curi/react';

import { NegButton } from 'components/common/Buttons';

import { updatePage } from 'actions';

function Rule(props) {
  const {
    name,
    attr,
    type,
    index,
    updatePage,
    params,
    page,
    element
  } = props;

  const canEdit = element.matches.length !== 0;

  return (
    <li className='rule'>
      <span className='rule-name' title='name'>{name}</span>
      <span className='rule-attr' title='attribute (or text)'>{attr}</span>
      <span className='rule-type' title='data type'>{type}</span>
      <Link
        to='Edit Rule'
        params={{ ...params, ruleIndex: index }}
        anchor='button'
        disabled={!canEdit}
        title={canEdit ? 'Edit the rule' : 'Cannot edit the rule because no elements in the current page match this element.'}
      >
        Edit
      </Link>
      <NegButton
        click={() => {
          element.rules = element.rules.filter((r,i) => i !== index);
          const newPage = {...page};
          updatePage(newPage);
        }}
      >
        Delete
      </NegButton>
    </li>
  );
}

Rule.propTypes = {
  name: PropTypes.string.isRequired,
  attr: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  index: PropTypes.number,
  params: PropTypes.object,
  /* connect */
  updatePage: PropTypes.func.isRequired,
  page: PropTypes.object,
  element: PropTypes.object
};

export default connect(
  (state, ownProps) => {
    const { name } = state.response.params;
    const { index } = ownProps.params;
    const { pages } = state;
    const page = pages.find(p => p.name === name);
    const element = page.elements[index];
    return {
      element,
      page
    };
  },
  {
    updatePage
  }
)(Rule);
