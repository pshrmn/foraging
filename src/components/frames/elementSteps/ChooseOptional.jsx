import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";
import { select } from "../../../helpers/selection";
import { highlight, unhighlight } from "../../../helpers/markup";
import { queryCheck } from "../../../constants/CSSClasses";

const ChooseOptional = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
    let optional = false;
    if ( endData.optional !== undefined ) {
      optional = endData.optional;
    } else if ( startData.optional !== undefined ) {
      optional = startData.optional;
    }
    return {
      optional
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
    const { error, optional } = this.state;
    const { startData } = this.props;
    const { current, selector } = startData
    return (
      <div className="info-box">
        <div className="info">
          <h3>
            Is this element optional?
          </h3>
          <label className={optional ? "selected" : null}>
            <input type="checkbox"
                   checked={optional}
                   onChange={this.toggleOptional} />
            { optional ? "Yes" : "No" }
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
    const { current, selector, spec } = startData;
    const elements = select(current.matches, selector, spec, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(queryCheck);
    const { startData } = nextProps;
    const { current, selector, spec } = startData;
    const elements = select(current.matches, selector, spec, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUnmount: function() {
    unhighlight(queryCheck);
  }
});

export default ChooseOptional;
