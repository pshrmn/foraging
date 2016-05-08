import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";
import { select, count } from "../../../helpers/selection";
import { highlight, unhighlight } from "../../../helpers/markup";
import { queryCheck } from "../../../constants/CSSClasses";

const AllValueStep = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
    let name = "";
    // if there is an existing value, only use it if the types match
    if ( endData.spec && endData.spec.name !== undefined ) {
      name = endData.spec.name;
    } else if ( startData.spec && startData.spec.name ) {
      name = startData.spec.name;
    }
    return {
      name: name,
      error: name === ""
    };
  },
  nameHandler: function(event) {
    const { value } = event.target;
    this.setState({
      name: value,
      error: value === ""
    });
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { name, error } = this.state;
    const { startData, next } = this.props;
    if ( error ) {
      return;
    }
    const newSpec = {
      type: "all",
      name
    }
    next(Object.assign({}, startData, { spec: newSpec }));
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
    const { name, error } = this.state;
    return (
      <div className="info-box">
        <div className="info">
          <h3>
            What should the array of elements be named?
          </h3>
          <input type="text"
                 placeholder="e.g., names"
                 value={name}
                 onChange={this.nameHandler} />
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
    const { startData } = this.props;
    const { current, selector } = startData;
    const { name } = this.state;
    const elements = select(current.matches, selector, {type: "all", name}, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(queryCheck);

    const { startData } = nextProps;
    const { current, selector } = startData;
    const { name } = nextState;
    const elements = select(current.matches, selector, {type: "all", name}, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUnmount: function() {
    unhighlight(queryCheck);
  }
});

export default AllValueStep;
