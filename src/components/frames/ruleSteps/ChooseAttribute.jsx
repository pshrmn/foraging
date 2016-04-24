import React from "react";

import { attributes } from "../../../helpers/attributes";
import { abbreviate } from "../../../helpers/text";
import { PosButton, NegButton } from "../../common/Buttons";
import Cycle from "./Cycle";

const ChooseAttribute = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
    const { attribute = "" } = endData;
    let index = 0;
    if ( endData.index !== undefined ) {
      index = endData.index;
    } else if ( startData.index !== undefined ) {
      index = startData.index;
    }
    return {
      attribute: attribute,
      index: index,
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
    const element = current.elements[index];
    const attrs = attributes(element).map((a,i) => {
      return (
        <li key={i}>
          <label>
            <input type="radio"
                   name="rule-attr"
                   value={a.name}
                   checked={a.name === attribute }
                   onChange={this.attributeHandler} />
            <span className="rule-attr">{a.name}</span> {abbreviate(a.value, 40)}
          </label>
        </li>
      );
    });
    return (
      <div>
        <div className="info">
          <h3>
            Which attribute has the value that you want?
          </h3>
          {attrs}
          <Cycle index={index}
                        count={current.elements.length}
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
