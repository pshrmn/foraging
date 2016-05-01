import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";
import { select, count } from "../../../helpers/selection";
import { highlight, unhighlight } from "../../../helpers/markup";
import { currentSelector } from "../../../constants/CSSClasses";

const SingleValueStep = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
    let value = 0;
    // if there is an existing value, only use it if the types match
    if ( endData.type === startData.type && endData.value !== undefined ) {
      value = endData.value;
    } else if ( startData.value !== undefined ) {
      value = startData.value;
    }
    return {
      value: value,
      error: false
    };
  },
  valueHandler: function(event) {
    const { value } = event.target;
    this.setState({
      value: parseInt(value, 10),
      error: false
    });
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { value, error } = this.state;
    const { startData, next } = this.props;
    if ( error ) {
      return;
    }
    next(Object.assign({}, startData, { value }));
  },
  previousHandler: function(event) {
    event.preventDefault();
    this.props.previous();
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  renderOptions: function() {
    const { startData, extraData } = this.props;
    const { selector } = startData;
    const { parent = {} } = extraData
    const { matches = [document] } = parent;

    const indices = count(matches, selector);
    return Array.from(new Array(indices)).map((u, i) => {
      return (
        <option key={i} value={i}>{i}</option>
      );
    });
  },
  render: function() {
    const { value, error } = this.state;

    return (
      <div className="info-box">
        <div className="info">
          <h3>
            The element at which index should be selected?
          </h3>
          <select value={value}
                  onChange={this.valueHandler} >
            { this.renderOptions() }
          </select>
        </div>
        <div className="buttons">
          <NegButton text="Previous" click={this.previousHandler} />
          <PosButton text="Next" click={this.nextHandler} disabled={error} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );    
  },
  componentWillMount: function() {
    const { startData, extraData } = this.props;

    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;

    const { value } = this.state;

    const elements = select(
      parentMatches,
      startData.selector,
      {type: "single", value},
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(currentSelector);

    const { startData, extraData } = nextProps;

    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;

    const { value } = nextState;

    const elements = select(
      parentMatches,
      startData.selector,
      {type: "single", value},
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  },
  componentWillUnmount: function() {
    unhighlight(currentSelector);
  }
});

export default SingleValueStep;
