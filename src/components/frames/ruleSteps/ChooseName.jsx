import React from "react";
import { connect } from "react-redux";

import { PosButton, NegButton } from "../../common/Buttons";
import { levelNames } from "../../../helpers/page";
import { showMessage } from "expiring-redux-messages";

const ChooseName = React.createClass({
  getInitialState: function() {
    const { startData, endData = {} } = this.props;
    
    let name = "";
    if ( endData.name ) {
      name = endData.name;
    } else if ( startData.name ) {
      name = startData.name;
    }

    return {
      name,
      error: name === ""
    };
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { name } = this.state;
    const { takenNames, showMessage } = this.props;

    if ( !takenNames.every(n => n !== name) ) {
      showMessage(`"${name}" is a duplicate and cannot be used.`, 5000, -1);
      return;
    }

    const { startData, next } = this.props;
    next(Object.assign({}, startData, { name }));
  },
  previousHandler: function(event) {
    event.preventDefault();
    this.props.previous();
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  nameHandler: function(event) {
    const name = event.target.value
    this.setState({
      name: name,
      error: name === ""
    });
  },
  render: function() {
    const { name, error } = this.state;
    return (
      <div className="info-box">
        <div className="info">
          <h3>
            What should the rule be named?
          </h3>
          <input type="text"
                 placeholder="e.g., name"
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
  }
});

export default connect(
  state => {
    const { page } = state;
    const { pages, pageIndex, elementIndex } = page;

    const currentPage = pages[pageIndex];
    return {
      takenNames: levelNames(currentPage.elements, elementIndex)
    };
  },
  {
    showMessage
  }
)(ChooseName);
