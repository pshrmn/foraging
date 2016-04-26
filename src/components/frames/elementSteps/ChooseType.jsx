import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";
import { select } from "../../../helpers/selection";
import { highlight, unhighlight } from "../../../helpers/markup";
import { queryCheck } from "../../../constants/CSSClasses";

const ChooseType = React.createClass({
  getInitialState: function() {
    const { endData = {} } = this.props;
    const { type = "single" } = endData;
    return {
      type: type
    };
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { type } = this.state;
    const { startData, next } = this.props;
    next(Object.assign({}, startData, { type }));
  },
  previousHandler: function(event) {
    event.preventDefault();
    this.props.previous();
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  typeHandler: function(event) {
    this.setState({
      type: event.target.value
    });
  },
  render: function() {
    const { type } = this.state;
    return (
      <div className="info-box">
        <div className="info">
          <h3>
            Should the element target a single element or all?
          </h3>

          <label>single <input type="radio"
                               name="type"
                               value="single"
                               checked={type === "single"}
                               onChange={this.typeHandler} />
          </label>
          <label>all <input type="radio"
                               name="type"
                               value="all"
                               checked={type === "all"}
                               onChange={this.typeHandler} />
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
    const { current, selector } = startData;
    const { type } = this.state;
    const value = type === "single" ? 0 : "name";
    const elements = select(current.elements, selector, {type, value}, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(queryCheck);

    const { startData } = nextProps;
    const { current, selector } = startData;
    const { type } = nextState;
    const value = type === "single" ? 0 : "name";
    const elements = select(current.elements, selector, {type, value}, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUnmount: function() {
    unhighlight(queryCheck);
  }
});

export default ChooseType;
