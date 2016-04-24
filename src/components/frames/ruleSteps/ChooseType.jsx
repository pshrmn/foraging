import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";
import Cycle from "./Cycle";

const ChooseType = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
    const { type = "string" } = endData;
    let index = 0;
    if ( endData.index !== undefined ) {
      index = endData.index;
    } else if ( startData.index !== undefined ) {
      index = startData.index;
    }
    return {
      type: "string",
      index: index
    };
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { type, index } = this.state;
    const { startData, next } = this.props;
    next(Object.assign({}, startData, { type, index }));
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
  indexHandler: function(index) {
    this.setState({
      index
    });
  },
  render: function() {
    const { type, index } = this.state;
    const { startData } = this.props;
    const { current, attribute } = startData;
    const element = current.elements[index];
    const value = attribute === "text" ?
      element.innerText : element.getAttribute(attribute);

    const typeRadios = ["string", "int", "float"].map((t,i) => {
      return (
        <label key={i}>
          <input type="radio"
                 name="rule-type"
                 value={t}
                 checked={t === type}
                 onChange={this.typeHandler} />
          <span className="rule-type">{t}</span>
        </label>
      );
    });

    return (
      <div>
        <div className="info">
          <h3>
            What type of value is this?
          </h3>
          {typeRadios}
          <p>
            {value}
          </p>
          <Cycle index={index}
                        count={current.elements.length}
                        setIndex={this.indexHandler} />
        </div>
        <div className="buttons">
          <NegButton text="Previous" click={this.previousHandler} />
          <PosButton text="Next" click={this.nextHandler} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
  }
});

export default ChooseType;
