import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Tree from 'components/Tree';
import Wizard from 'simple-wizard-component';
import {
  Elements,
  Parts,
  CreateType as Type,
  CreateValue as Value,
  CreateOptional as Optional,
  ConfirmElement
} from 'components/steps/element';

import { saveElement, showElementFrame } from 'actions';
import { highlight, unhighlight} from 'helpers/markup';
import { currentElement } from 'helpers/store';
import { currentSelector } from 'constants/CSSClasses';

const steps = [
  Elements,
  Parts,
  Type,
  Value,
  Optional,
  ConfirmElement
];

/*
 * Elements -> Parts -> Type -> Value -> Optional -> ConfirmElement
 * each step should make sure to pass the current object (the currently
 * selected element selector) as a property of the object returned
 * in its next call
 */
class ElementWizard extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  save(ele) {
    this.props.saveElement(ele);
  }

  cancel() {
    this.props.cancel();
  }

  render() {
    const { current } = this.props;

    return (
      <div className='frame'>
        <Tree />
        <Wizard
          steps={steps}
          initialData={{}}
          staticData={{
            parent: current
          }}
          save={this.save}
          cancel={this.cancel}
        />
      </div>
    );
  }

  componentWillMount() {
    const { current } = this.props;
    highlight(current.matches, currentSelector);
  }

  componentWillUpdate(nextProps) {
    unhighlight(currentSelector);
    const { current } = nextProps;
    highlight(current.matches, currentSelector);
  }

  componentWillUnmount() {
    unhighlight(currentSelector);
  }
}

ElementWizard.propTypes = {
  current: PropTypes.object,
  saveElement: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
};

export default connect(
  state => {
    const { page } = state;
    return {
      current: currentElement(page)
    };
  },
  {
    saveElement,
    cancel: showElementFrame
  }
)(ElementWizard);
