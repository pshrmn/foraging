import React from 'react';
import { connect } from 'react-redux';

import Tree from 'components/Tree';
import Wizard from 'simple-wizard-component';
import {
  ChooseElements,
  ChooseParts,
  ChooseType,
  ChooseValue,
  ChooseOptional,
  ConfirmElement
} from 'components/steps/element';

import { saveElement, showElementFrame } from 'actions';
import { highlight, unhighlight} from 'helpers/markup';
import { currentElement } from 'helpers/store';
import { currentSelector } from 'constants/CSSClasses';

const steps = [
  ChooseElements,
  ChooseParts,
  ChooseType,
  ChooseValue,
  ChooseOptional,
  ConfirmElement
];

/*
 * ChooseElements -> ChooseParts -> ChooseType ->
 *   ChooseValue -> ChooseOptional -> ConfirmElement
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
    const initialData = {
      current
    };

    return (
      <div className='frame'>
        <Tree />
        <Wizard
          steps={steps}
          initialData={initialData}
          save={this.save}
          cancel={this.cancel} />
      </div>
    );
  }

  componentWillMount() {
    const { current } = this.props;
    highlight(current.matches, currentSelector);
  }

  componentWillUpdate(nextProps, nextState) {
    unhighlight(currentSelector);
    const { current } = this.props;
    highlight(current.matches, currentSelector);
  }

  componentWillUnmount() {
    unhighlight(currentSelector);
  }
}

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
