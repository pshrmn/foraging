import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";

const ChooseName = React.createClass({
  getInitialState: function() {
    const { endData = {} } = this.props;
    const { name = "" } = endData;

    return {
      name: name,
      error: name === ""
    };
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { name } = this.state;
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

export default ChooseName;
