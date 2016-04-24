import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";
import { select } from "../../../helpers/selection";
import { highlight, unhighlight } from "../../../helpers/markup";
import { queryCheck } from "../../../constants/CSSClasses";

const ChooseOptional = React.createClass({
  getInitialState: function() {
    const { endData = {} } = this.props;
    const { optional = false } = endData;
    return {
      optional: optional
    };
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { optional } = this.state;
    const { startData, next } = this.props;
    next(Object.assign({}, startData, { optional }));
  },
  previousHandler: function(event) {
    event.preventDefault();
    this.props.previous();
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  toggleOptional: function(event) {
    this.setState({
      optional: event.target.checked
    });
  },
  render: function() {
    const { error } = this.state;
    const { startData } = this.props;
    const { current, selector } = startData
    return (
      <div>
        <div className="info">
          <h3>
            Is this element optional?
          </h3>
          <label>
            <input type="checkbox"
                   checked={this.state.optional}
                   onChange={this.toggleOptional} />
          </label>
        </div>
        <div className="buttons">
          <NegButton text="Previous" click={this.previousHandler} />
          <PosButton text="Next" click={this.nextHandler} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
  },
  componentWillMount: function() {
    const { startData } = this.props;
    const { current, selector, type, value } = startData;
    const elements = select(current.elements, selector, {type, value}, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(queryCheck);
    const { startData } = nextProps;
    const { current, selector, type, value } = startData;
    const elements = select(current.elements, selector, {type, value}, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUnmount: function() {
    unhighlight(queryCheck);
  }
});

export default ChooseOptional;
