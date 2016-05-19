import React from 'react';
import { connect } from 'react-redux';

import Element from './Element';
import { PosButton, NegButton, NeutralButton } from './common/Buttons';
import {
  showElementWizard,
  removeElement,
  showRuleWizard,
  showEditElementWizard
} from '../actions';

/*
 * An ElementCard is used to display a selector Element and its control functions
 */
const ElementCard = React.createClass({
  propTypes: {
    element: React.PropTypes.object,
    active: React.PropTypes.bool
  },
  remove: function(event) {
    const { element, removeElement } = this.props;
    const msg = element.index === 0 ?
      'Are you sure you want to reset the page? This will delete all rules and child elements' :
      `Are you sure you want to delete the element "${element.selector}"?`
    if ( !confirm(msg)) {
      return;
    }
    removeElement();
  },
  render: function() {
    const {
      element = {},
      active = true,
      showElementWizard,
      showRuleWizard,
      showEditElementWizard
    } = this.props;
    const isRoot = element.index === 0;
    return (
      <div className='info-box'>
        <div className='info'>
          <Element active={active} {...element} />
        </div>
        <div className='buttons'>
          <PosButton
            text='Add Child'
            disabled={!active}
            click={() => { showElementWizard(); }} />
          <PosButton
            text='Add Rule'
            disabled={!active}
            click={() => { showRuleWizard(); }} />
          <NeutralButton
            text='Edit'
            disabled={!active || isRoot}
            click={() => { showEditElementWizard(); }} />
          <NegButton
            text={isRoot ? 'Reset' : 'Delete'}
            title={isRoot ? 'Reset Page' : 'Delete Element'}
            disabled={!active}
            click={this.remove} />
        </div>
      </div>
    );
  }
});

export default connect(
  null,
  {
    showElementWizard,
    removeElement,
    showRuleWizard,
    showEditElementWizard
  }
)(ElementCard);
