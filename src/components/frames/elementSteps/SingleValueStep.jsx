import React from "react";

import Controls from "../common/Controls";
import SingleForm from "../elementForms/SingleForm";

import { select, count } from "../../../helpers/selection";
import { highlight, unhighlight } from "../../../helpers/markup";
import { queryCheck } from "../../../constants/CSSClasses";

const SingleValueStep = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
    let index = 0;
    // if there is an existing value, only use it if the types match
    if ( endData.spec && endData.spec.index !== undefined ) {
      index = endData.spec.index;
    } else if ( startData.spec && startData.spec.index !== undefined ) {
      index = startData.spec.index;
    }
    return {
      index,
      error: false
    };
  },
  indexHandler: function(event) {
    const { value } = event.target;
    this.setState({
      index: parseInt(value, 10),
      error: false
    });
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { index, error } = this.state;
    const { startData, next } = this.props;
    if ( error ) {
      return;
    }
    const newSpec = {
      type: "single",
      index
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
    const { index, error } = this.state;
    const { startData } = this.props;
    const { current, selector } = startData;

    const indices = count(current.matches, selector);
    
    return (
      <form className="info-box">
        <div className="info">
          <SingleForm index={index} count={indices} setIndex={this.indexHandler} />
        </div>
        <Controls
          previous={this.previousHandler}
          next={this.nextHandler}
          cancel={this.cancelHandler}
          error={error} />
      </form>
    );    
  },
  componentWillMount: function() {
    const { startData } = this.props;
    const { current, selector } = startData;
    const { index } = this.state;
    const elements = select(current.matches, selector, {type: "single", index}, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(queryCheck);

    const { startData } = nextProps;
    const { current, selector } = startData;
    const { index } = nextState;
    const elements = select(current.matches, selector, {type: "single", index}, '.forager-holder');
    highlight(elements, queryCheck);
  },
  componentWillUnmount: function() {
    unhighlight(queryCheck);
  }
});

export default SingleValueStep;
