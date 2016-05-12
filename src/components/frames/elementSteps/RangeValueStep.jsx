import React from "react";
import { connect } from "react-redux";

import { PosButton, NegButton } from "../../common/Buttons";
import { select, count } from "../../../helpers/selection";
import { highlight, unhighlight } from "../../../helpers/markup";
import { levelNames } from "../../../helpers/page";
import { showMessage } from "expiring-redux-messages";
import { queryCheck } from "../../../constants/CSSClasses";

const RangeValueStep = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
    let name = "";
    let low = 0;
    let high = "end";
    // if there is an existing value, only use it if the types match
    if ( endData.spec ) {
      if ( endData.spec.name ) {
        name = endData.spec.name;
      }
      if ( endData.spec.low !== undefined) {
        low = endData.spec.low;
      }
      if ( endData.spec.high !== undefined ) {
        high = endData.spec.high === null ? "end" : endData.spec.high;
      }
    } else if ( startData.spec ) {
      if ( startData.spec.name ) {
        name = startData.spec.name;
      }
      if ( startData.spec.low !== undefined) {
        low = startData.spec.low;
      }
      if ( startData.spec.high !== undefined ) {
        high = startData.spec.high === null ? "end" : startData.spec.high;
      }
    }
    return {
      name,
      low,
      high,
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
  lowHandler: function(event) {
    const { value } = event.target;
    let low = parseInt(value, 10);
    let { high } = this.state;
    if ( low > high ) {
      [high, low] = [low, high];
    }
    this.setState({
      low,
      high
    });
  },
  highHandler: function(event) {
    const { value } = event.target;
    if ( value === "end" ) {
      this.setState({
        high: value
      });
      return;
    }
    let high = parseInt(value, 10);
    let { low } = this.state;
    if ( low > high ) {
      [high, low] = [low, high];
    }
    this.setState({
      low,
      high
    });
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { name, low, high, error } = this.state;
    const {
      startData,
      next,
      takenNames,
      showMessage
    } = this.props;

    if ( !takenNames.every(n => n !== name) ) {
      showMessage(`"${name}" is a duplicate and cannot be used.`, 5000, -1);
      return;
    }

    if ( error ) {
      return;
    }
    const newSpec = {
      type: "range",
      name,
      low,
      high: high === "end"? null : high, // convert "end" to null
    };
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
    const { name, low, high, error } = this.state;
    const { startData } = this.props;
    const { current, selector } = startData;

    const indices = count(current.matches, selector);
    const lowOptions = Array.from(new Array(indices)).map((u, i) => {
      return (
        <option key={i} value={i}>{i}</option>
      );
    });
    const lowSelect = (
      <select value={low} onChange={this.lowHandler}>{lowOptions}</select>
    );
    const highOptions = Array.from(new Array(indices)).map((u, i) => {
      return (
        <option key={i} value={i}>{i}</option>
      );
    });
    const highSelect = (
      <select value={high} onChange={this.highHandler}>
        {highOptions.concat([<option key="end" value="end">end</option>])}
      </select>
    );

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

          <h3>
            Which elements should be selected?
          </h3>
          {lowSelect} - {highSelect}
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
    const { name, low } = this.state;
    let { high } = this.state;
    if ( high === "end" ) {
      high = null;
    }
    const elements = select(
      current.matches,
      selector,
      {type: "range", name, low, high},
      '.forager-holder'
    );
    highlight(elements, queryCheck);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(queryCheck);

    const { startData } = nextProps;
    const { current, selector } = startData;
    const { name, low } = nextState;
    let { high } = nextState;
    if ( high === "end" ) {
      high = null;
    }
    const elements = select(
      current.matches,
      selector,
      {type: "range", name, low, high},
      '.forager-holder'
    );
    highlight(elements, queryCheck);
  },
  componentWillUnmount: function() {
    unhighlight(queryCheck);
  }
});

export default connect(
  state => {
    const { page } = state;
    const { pages, pageIndex, elementIndex } = page;

    const currentPage = pages[pageIndex];
    // use the current element's parent (if it has one) to get
    // the level because the take names for the current element
    // are in a different level. For the root node, use the elementIndex
    // (but this should never happen)
    const current = currentPage.elements[elementIndex];
    const index = current.parent !== null ? current.parent : elementIndex;
    return {
      takenNames: levelNames(currentPage.elements, index)
    };
  },
  {
    showMessage
  }
)(RangeValueStep);
