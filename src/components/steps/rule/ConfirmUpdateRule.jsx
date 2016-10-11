import React from 'react';

import Controls from 'components/common/StepControls';

class ConfirmElement extends React.Component {
  constructor(props) {
    super(props);

    this.saveHandler = this.saveHandler.bind(this);
    this.previousHandler = this.previousHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
  }

  saveHandler(event) {
    event.preventDefault();
    const { startData, next: save } = this.props;
    const { name, attribute, type } = startData;
    save({
      name: name,
      type: type,
      attr: attribute
    });
  }

  previousHandler(event) {
    event.preventDefault();
    this.props.previous();
  }

  cancelHandler(event) {
    event.preventDefault();
    this.props.cancel();
  }

  render() {
    const { startData } = this.props;
    const { name, attribute, type } = startData;
    return (
      <form className='info-box'>
        <h2>Confirm Updated Rule</h2>
        <ul>
          <li>Name: {name}</li>
          <li>Attribute: {attribute}</li>
          <li>Type: {type}</li>
        </ul>
        <Controls
          previous={this.previousHandler}
          next={this.saveHandler}
          nextText='Update'
          cancel={this.cancelHandler} />
      </form>
    );
  }
}

export default ConfirmElement;
