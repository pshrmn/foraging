import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Element from 'components/Element';
/*
import { PosButton, NegButton, NeutralButton } from 'components/common/Buttons';
import {
  showElementWizard,
  removeElement,
  showRuleWizard,
  showEditElementWizard
} from 'actions';
*/

/*
 * An ElementCard is used to display a selector Element and its control functions
 */
function ElementCard(props) {
  const {
    element = {},
    active = true,
    /*showElementWizard,
    showRuleWizard,
    showEditElementWizard,
    removeElement*/
  } = props;

  //const isRoot = element.index === 0;

  return (
    <div className='info-box'>
      <div className='info'>
        <Element active={active} {...element} />
      </div>
      {/*
      <div className='buttons'>
        <PosButton
          text='Add Child'
          disabled={!active}
          click={() => { showElementWizard(); }}
        />
        <PosButton
          text='Add Rule'
          disabled={!active}
          click={() => { showRuleWizard(); }}
        />
        <NeutralButton
          text='Edit'
          disabled={!active || isRoot}
          click={() => { showEditElementWizard(); }}
        />
        <NegButton
          text={isRoot ? 'Reset' : 'Delete'}
          title={isRoot ? 'Reset Page' : 'Delete Element'}
          disabled={!active}
          click={() => { removeElement(); }}
        />
      </div>
      */}
    </div>
  );
}

ElementCard.propTypes = {
  element: PropTypes.object,
  active: PropTypes.bool,
  /*
  showElementWizard: PropTypes.func.isRequired,
  showRuleWizard: PropTypes.func.isRequired,
  showEditElementWizard: PropTypes.func.isRequired,
  removeElement: PropTypes.func.isRequired
  */
};

export default connect(
  state => {
    const { pages, current, elementIndex } = state.page;
    const page = pages.find(p => p.name === current);
    return {
      element: page.elements[elementIndex]
    };
  }
)(ElementCard); /*connect(
  null,
  {
    showElementWizard,
    removeElement,
    showRuleWizard,
    showEditElementWizard
  }
)(ElementCard);
*/