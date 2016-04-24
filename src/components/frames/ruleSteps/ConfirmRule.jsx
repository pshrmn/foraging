import React from "react";

import { PosButton, NegButton } from "../../common/Buttons";

const ConfirmElement = React.createClass({
  saveHandler: function() {
    const { startData, next: save } = this.props;
    const { name, attribute, type } = startData;
    save({
      name: name,
      type: type,
      attr: attribute
    });
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
    const { startData } = this.props;
    const { name, attribute, type } = startData;
    return (
      <div className="confirm-element">
        <h2>Confirm Rule</h2>
        <ul>
          <li>Name: {name}</li>
          <li>Attribute: {attribute}</li>
          <li>Type: {type}</li>
        </ul>
        <div className="buttons">
          <NegButton text="Previous" click={this.previousHandler} />
          <PosButton text="Save" click={this.saveHandler} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
  }
});

export default ConfirmElement;
