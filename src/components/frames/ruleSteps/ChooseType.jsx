import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";
import Cycle from "./Cycle";
import { abbreviate } from "../../../helpers/text";
import { integer, float } from "../../../helpers/parse";

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
    const element = current.matches[index];
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

    let preview;
    switch (type) {
    case "string":
      preview = abbreviate(value, 40);
      break;
    case "int":
      preview = integer(value);
      if ( preview === null ) {
        preview = "No int detected";
      }
      break;
    case "float":
      preview = float(value);
      if ( preview === null ) {
        preview = "No float detected";
      }
      break;
    }

    return (
      <div className="info-box">
        <div className="info">
          <h3>
            What type of value is this?
          </h3>
          {typeRadios}
          <p>
            {preview}
          </p>
          <Cycle index={index}
                 count={current.matches.length}
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
