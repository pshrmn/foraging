import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { NegButton, NeutralButton } from 'components/common/Buttons';

import {
  removeRule,
  showEditRuleWizard
} from '../actions';


function Rule(props) {
  const {
    name,
    attr,
    type,
    active = true,
    index,
    removeRule,
    updateRule
  } = props;

  return (
    <li className='rule'>
      <span className='rule-name' title='name'>{name}</span>
      <span className='rule-attr' title='attribute (or text)'>{attr}</span>
      <span className='rule-type' title='data type'>{type}</span>
      { active ? <NeutralButton text='Edit' click={() => { updateRule(index); }} /> : null }
      { active ? <NegButton text='Delete' click={() => { removeRule(index); }} /> : null }
    </li>
  );
}

Rule.propTypes = {
  removeRule: PropTypes.func.isRequired,
  updateRule: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  attr: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  active: PropTypes.bool,
  index: PropTypes.number
};

export default connect(
  null,
  {
    removeRule,
    updateRule: showEditRuleWizard,
  }
)(Rule);
