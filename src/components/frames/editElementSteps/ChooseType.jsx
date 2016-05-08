import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";
import { select } from "../../../helpers/selection";
import { highlight, unhighlight } from "../../../helpers/markup";
import { currentSelector } from "../../../constants/CSSClasses";

const ChooseType = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
    let type = "single";
    if ( endData.spec && endData.spec.type ) {
      type = endData.spec.type;
    } else if ( startData.spec && startData.spec.type ) {
      type = startData.spec.type;
    }

    return {
      type
    };
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { type } = this.state;
    const { startData, next } = this.props;
    // handle resetting the value here if the type is changing
    let { spec } = startData;
    const newSpec = {
      type
    };
    if ( type === "single" ) {
      newSpec.index = type !== spec.type ? 0 : spec.index;
    } else {
      newSpec.name = type !== spec.type ? "" : spec.name;
    }
    next(Object.assign({}, startData, {spec: newSpec}));
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

          <label className={type === "single" ? "selected": null}>
            <input type="radio"
                   name="type"
                   value="single"
                   checked={type === "single"}
                   onChange={this.typeHandler} />
            single
          </label>
          <label className={type === "all" ? "selected": null}>
            <input type="radio"
                   name="type"
                   value="all"
                   checked={type === "all"}
                   onChange={this.typeHandler} />
            all
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
    const { startData, extraData } = this.props;

    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;

    const { type } = this.state;
    const spec = {
      type
    }
    // use set single index if possible
    if ( type === "single" ) {
      const wasSingle = startData.spec && startData.spec.type === "single";
      spec.index = wasSingle ? startData.spec.index : 0
    }
    
    const elements = select(
      parentMatches,
      startData.selector,
      spec,
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(currentSelector);

    const { startData, extraData } = nextProps;

    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;

    const { type } = nextState;
    const spec = {
      type
    }
    // use set single index if possible
    if ( type === "single" ) {
      const wasSingle = startData.spec && startData.spec.type === "single";
      spec.index = wasSingle ? startData.spec.index : 0
    }

    const elements = select(
      parentMatches,
      startData.selector,
      spec,
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  },
  componentWillUnmount: function() {
    unhighlight(currentSelector);
  }
});

export default ChooseType;
