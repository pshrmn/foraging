import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";
import { select } from "../../../helpers/selection";
import { highlight, unhighlight } from "../../../helpers/markup";
import { currentSelector } from "../../../constants/CSSClasses";

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
    const { startData, extraData } = this.props;

    const { selector, type, value } = startData;
    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;
    const elements = select(
      parentMatches,
      startData.selector,
      {type, value},
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(currentSelector);

    const { startData, extraData } = this.props;

    const { selector, type, value } = startData;
    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;
    const elements = select(
      parentMatches,
      startData.selector,
      {type, value},
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  },
  componentWillUnmount: function() {
    unhighlight(currentSelector);
  }
});

export default ChooseOptional;
