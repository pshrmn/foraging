import React from 'react';

import Controls from '../common/Controls';

const ConfirmElement = React.createClass({
  saveHandler: function(event) {
    event.preventDefault();
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
      <form className='info-box'>
        <h2>Confirm Rule</h2>
        <ul>
          <li>Name: {name}</li>
          <li>Attribute: {attribute}</li>
          <li>Type: {type}</li>
        </ul>
        <Controls
          previous={this.previousHandler}
          next={this.saveHandler}
          nextText='Save'
          cancel={this.cancelHandler} />
      </form>
    );
  }
});

export default ConfirmElement;
