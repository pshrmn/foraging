import React from "react";

import { attributes } from "../../../helpers/attributes";
import { abbreviate } from "../../../helpers/text";
import { PosButton, NegButton } from "../../common/Buttons";
import Cycle from "./Cycle";

const ChooseAttribute = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
  
    let attribute = "";
    if ( endData.attribute ) {
      attribute = endData.attribute;
    } else if ( startData.attr ) {
      attribute = startData.attr;
    }

    let index = 0;
    if ( endData.index !== undefined ) {
      index = endData.index;
    } else if ( startData.index !== undefined ) {
      index = startData.index;
    }
    return {
      attribute,
      index,
      error: attribute === ""
    };
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { attribute, index, error } = this.state;

    if ( error ) {
      return;
    }

    const { startData, next } = this.props;
    next(Object.assign({}, startData, { attribute, index }));
  },
  previousHandler: function(event) {
    event.preventDefault();
    this.props.previous();
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  attributeHandler: function(event) {
    this.setState({
      attribute: event.target.value,
      error: false
    });
  },
  indexHandler: function(index) {
    this.setState({
      index
    });
  },
  render: function() {
    const { attribute, index, error } = this.state;
    const { startData } = this.props;
    const { current } = startData;
    const element = current.matches[index];
    const attrs = attributes(element).map((a,i) => {
      return (
        <li key={i}>
          <label>
            <input type="radio"
                   name="rule-attr"
                   value={a.name}
                   checked={a.name === attribute }
                   onChange={this.attributeHandler} />
            {a.name}
          </label>
          {abbreviate(a.value, 40)}
        </li>
      );
    });
    return (
      <div className="info-box">
        <div className="info">
          <h3>
            Which attribute has the value that you want?
          </h3>
          <ul>
            {attrs}
          </ul>
          <Cycle index={index}
                 count={current.matches.length}
                 setIndex={this.indexHandler} />
        </div>
        <div className="buttons">
          <NegButton text="Previous" click={this.previousHandler} />
          <PosButton text="Next" click={this.nextHandler} disabled={error} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
  }
});

export default ChooseAttribute;
