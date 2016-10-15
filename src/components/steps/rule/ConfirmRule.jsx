import React from 'react';

import Controls from 'components/common/StepControls';

class Confirm extends React.Component {
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
    const {
      startData,
      buttonText,
      title
    } = this.props;
    const { name, attribute, type } = startData;
    return (
      <form className='info-box'>
        <h2>{title}</h2>
        <ul>
          <li>Name: {name}</li>
          <li>Attribute: {attribute}</li>
          <li>Type: {type}</li>
        </ul>
        <Controls
          previous={this.previousHandler}
          next={this.saveHandler}
          nextText={buttonText}
          cancel={this.cancelHandler} />
      </form>
    );
  }
}

Confirm.propTypes = {
  startData: React.PropTypes.object.isRequired,
  title: React.PropTypes.string.isRequired,
  buttonText: React.PropTypes.string.isRequired,
  next: React.PropTypes.func.isRequired,
  previous: React.PropTypes.func.isRequired,
  cancel: React.PropTypes.func.isRequired
};

export const ConfirmSaveRule = props => (
  <Confirm
    title='Confirm Rule'
    buttonText='Save'
    {...props} />
);

export const ConfirmUpdateRule = props => (
  <Confirm
    title='Confirm Update Rule'
    buttonText='Update'
    {...props} />
);
