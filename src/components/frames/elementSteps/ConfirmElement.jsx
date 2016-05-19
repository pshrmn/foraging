import React from 'react';

import Controls from '../common/Controls';

import { createElement } from '../../../helpers/page';
import { select } from '../../../helpers/selection';
import { highlight, unhighlight } from '../../../helpers/markup';
import { queryCheck } from '../../../constants/CSSClasses';

const ConfirmElement = React.createClass({
  saveHandler: function(event) {
    event.preventDefault();
    const { startData, next: save } = this.props;
    const { current, selector, spec, optional } = startData;
    const ele = createElement(selector, spec, optional);
    save(ele);
  },
  previousHandler: function(event) {
    event.preventDefault();
    this.props.previous();
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  render: function() {
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
  },
  componentWillMount: function() {
    const { startData } = this.props;
    const { current, selector, spec } = startData;
    const elements = select(current.matches, selector, spec, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUnmount: function() {
    unhighlight(queryCheck);
  }
});

export default ConfirmElement;
