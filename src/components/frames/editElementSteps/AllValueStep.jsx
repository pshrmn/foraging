import React from "react";
import { connect } from "react-redux";

import { PosButton, NegButton } from "../../common/Buttons";
import { select, count } from "../../../helpers/selection";
import { highlight, unhighlight } from "../../../helpers/markup";
import { levelNames } from "../../../helpers/page";
import { showMessage } from "expiring-redux-messages";
import { currentSelector } from "../../../constants/CSSClasses";

const AllValueStep = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
    let name = "";
    // if there is an existing value, only use it if the types match
    if ( endData.spec && endData.spec.name !== undefined ) {
      name = endData.spec.name;
    } else if ( startData.spec && startData.spec.name !== undefined ) {
      name = startData.spec.name;
    }
    return {
      name,
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
  nextHandler: function(event) {
    event.preventDefault();
    const { name, error } = this.state;
    const {
      startData,
      extraData,
      next,
      takenNames,
      showMessage
    } = this.props;
    // do not do duplicate test if the name isn't changing
    const originalName = extraData.originalSpec.name;
    if ( name !== originalName && !takenNames.every(n => n !== name) ) {
      showMessage(`"${name}" is a duplicate and cannot be used.`, 5000, -1);
      return;
    }

    if ( error ) {
      return;
    }
    const newSpec = {
      type: "all",
      name
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
    const { name, error } = this.state;
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
    const { startData, extraData } = this.props;

    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;

    const { name } = this.state;

    const elements = select(
      parentMatches,
      startData.selector,
      {type: "all", name},
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(currentSelector);

    const { startData, extraData } = nextProps;

    const { parent = {} } = extraData;
    const { matches: parentMatches = [document] } = parent;

    const { name } = nextState;

    const elements = select(
      parentMatches,
      startData.selector,
      {type: "all", name},
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  },
  componentWillUnmount: function() {
    unhighlight(currentSelector);
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
)(AllValueStep);
