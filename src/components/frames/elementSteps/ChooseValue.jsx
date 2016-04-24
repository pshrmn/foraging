import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";
import NoSelectMixin from "../../NoSelectMixin";
import { select, count } from "../../../helpers/selection";
import { highlight, unhighlight } from "../../../helpers/markup";
import { queryCheck } from "../../../constants/CSSClasses";

const ChooseValue = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
    const { value } = endData;
    // if there is an existing value, only use it if the
    // types match
    if ( value && startData.type === endData.type) {
      return {
        value: value,
        error: false
      };
    }
    // otherwise use default values based on the type
    return {
      value: startData.type === "single" ? 0 : "",
      error: startData.type === "all"
    };
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
  valueHandler: function(event) {
    const { value } = event.target;
    const { startData } = this.props;
    const { type } = startData;
    if ( type === "single" ) {
      this.setState({
        value: parseInt(value, 10),
        error: false
      })
    } else {
      this.setState({
        value: value,
        error: value === ""
      });
    }
  },
  _singleValue: function() {
    const { value } = this.state;
    const { startData } = this.props;
    const { current, selector } = startData;
    const elementCount = count(current.elements, selector);
    const options = Array.from(new Array(elementCount)).map((u, i) => {
      return (
        <option key={i} value={i}>{i}</option>
      );
    });
    return (
      <div>
        <h3>
          The element at which index should be selected?
        </h3>
        <select value={value}
                onChange={this.valueHandler} >
          {options}
        </select>
      </div>
    );
  },
  _allValue: function() {
    return (
      <div>
        <h3>
          What should the elements be named?
        </h3>
        <input type="text"
               value={this.state.value}
               onChange={this.valueHandler} />
      </div>
    );
  },
  render: function() {
    const { startData } = this.props;
    const { error } = this.state;
    const { type } = startData;
    let input = null;
    switch ( type ) {
    case "all":
      input = this._allValue();
      break;
    case "single":
      input = this._singleValue();
      break;
    }
    return (
      <div>
        <div className="info">
          {input}
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
    const { current, selector, type } = startData;
    const { value } = this.state;
    const elements = select(current.elements, selector, {type, value});
    highlight(elements, queryCheck);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(queryCheck);

    const { startData } = nextProps;
    const { current, selector, type } = startData;
    const { value } = nextState;
    const elements = select(current.elements, selector, {type, value});
    highlight(elements, queryCheck);
  },
  componentWillUnmount: function() {
    unhighlight(queryCheck);
  }
});

export default ChooseValue;
