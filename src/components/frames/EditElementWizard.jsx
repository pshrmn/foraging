import React from 'react';
import { connect } from 'react-redux';

import Wizard from 'simple-wizard-component';
import Tree from 'components/Tree';
import {
  EditValue as Value,
  EditOptional as Optional,
  EditType as Type,
  ConfirmUpdate
} from 'components/steps/element';

import { updateElement, showElementFrame } from 'actions';
import { currentElement, currentParent } from 'helpers/store';
const steps = [
  Type,
  Value,
  Optional,
  ConfirmUpdate
];

/*
 * Type -> Value -> Optional -> ConfirmUpdate
 * each step should make sure to pass the current object (the currently
 * selected element selector) as a property of the object returned
 * in its next call
 */
class EditElementWizard extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  save(newProps) {
    const { current, updateElement } = this.props;
    const { spec, optional } = newProps;
    updateElement(current.index, {
      spec,
      optional
    });
  }

  cancel() {
    this.props.cancel();
  }

  render() {
    const { current, parent } = this.props;
    const { selector, spec, optional } = current;
    return (
      <div className='frame'>
        <Tree />
        <Wizard
          steps={steps}
          initialData={{
            selector,
            spec,
            optional
          }}
          staticData={{
            parent,
            originalSpec: spec
          }}
          save={this.save}
          cancel={this.cancel} />
      </div>
    );
  }
}

export default connect(
  state => {
    const { page } = state;
    return {
      current: currentElement(page),
      parent: currentParent(page)
    };
  },
  {
    updateElement,
    cancel: showElementFrame
  }
)(EditElementWizard);
