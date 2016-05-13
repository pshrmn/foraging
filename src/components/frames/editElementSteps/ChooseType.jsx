import React from "react";

import Controls from "../common/Controls";
import TypeForm from "../elementForms/TypeForm.jsx";

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
    next(Object.assign({}, startData, {spec: newSpec}));
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
    const types = ["single", "all", "range"];

    return (
      <form className="info-box">
        <div className="info">
          <TypeForm types={types} current={type} setType={this.typeHandler} />
        </div>
        <Controls
          next={this.nextHandler}
          cancel={this.cancelHandler} />
      </form>
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
    } else if ( type === "range" ) {
      const wasRange = startData.spec && startData.spec.type === "range";
      spec.low = wasRange ? startData.spec.low : 0;
      spec.high = wasRange ? startData.spec.high : undefined;
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
    } else if ( type === "range" ) {
      const wasRange = startData.spec && startData.spec.type === "range";
      spec.low = wasRange ? startData.spec.low : 0;
      spec.high = wasRange ? startData.spec.high : undefined;
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
