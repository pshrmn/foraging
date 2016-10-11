import React from 'react';

import Controls from 'components/common/StepControls';

import { createElement } from 'helpers/page';
import { select } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { queryCheck } from 'constants/CSSClasses';

class ConfirmElement extends React.Component {
  constructor(props) {
    super(props);

    this.saveHandler = this.saveHandler.bind(this);
    this.previousHandler = this.previousHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }

  saveHandler(event) {
    event.preventDefault();
    const { startData, next: save } = this.props;
    const { current, selector, spec, optional } = startData;
    const ele = createElement(selector, spec, optional);
    save(ele);
  }

  previousHandler(event) {
    event.preventDefault();
    this.props.previous();
  }

  cancelHandler(event) {
    event.preventDefault();
    this.props.cancel();
  }

  render() {
    const { startData } = this.props;
    const { selector, spec, optional } = startData;
    return (
      <form className='info-box'>
        <h2>Confirm Element</h2>
        <ul>
          <li>Selector: {selector}</li>
          <li>Spec: {JSON.stringify(spec, null, '\t')}</li>
          <li>Optional: {optional ? 'Yes' : 'No'}</li>
        </ul>
        <Controls
          previous={this.previousHandler}
          next={this.saveHandler}
          nextText='Save'
          cancel={this.cancelHandler} />
      </form>
    );
  }

  componentWillMount() {
    const { startData } = this.props;
    const { current, selector, spec } = startData;
    const elements = select(current.matches, selector, spec, '.forager-holder');
    highlight(elements, queryCheck);
  }

  componentWillUnmount() {
    unhighlight(queryCheck);
  }
}

export default ConfirmElement;
