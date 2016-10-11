import React from 'react';
import { connect } from 'react-redux';

import Controls from 'components/common/StepControls';

import { levelNames } from 'helpers/page';
import { showMessage } from 'expiring-redux-messages';

function initialName(props) {
  const { startData, endData = {} } = props;    
  let name = '';
  if ( endData.name ) {
    name = endData.name;
  } else if ( startData.name ) {
    name = startData.name;
  }
  return name;
}

class ChooseName extends React.Component {
  constructor(props) {
    super(props);
    const name = initialName(props);
    this.state = {
      name,
      error: name === ''
    };

    this.nextHandler = this.nextHandler.bind(this);
    this.previousHandler = this.previousHandler.bind(this);
    this.cancelHandler = this.cancelHandler.bind(this);
    this.nameHandler = this.nameHandler.bind(this);
  }

  nextHandler(event) {
    event.preventDefault();
    const { name } = this.state;
    const { takenNames, showMessage } = this.props;

    if ( !takenNames.every(n => n !== name) ) {
      showMessage(`"${name}" is a duplicate name and cannot be used.`, 5000, -1);
      return;
    }

    const { startData, next } = this.props;
    next(Object.assign({}, startData, { name }));
  }

  previousHandler(event) {
    event.preventDefault();
    this.props.previous();
  }

  cancelHandler(event) {
    event.preventDefault();
    this.props.cancel();
  }

  nameHandler(event) {
    const name = event.target.value
    this.setState({
      name: name,
      error: name === ''
    });
  }

  render() {
    const { name, error } = this.state;
    return (
      <form className='info-box'>
        <div className='info'>
          <h3>
            What should the rule be named?
          </h3>
          <input
            type='text'
            placeholder='e.g., name'
            value={name}
            onChange={this.nameHandler} />
        </div>
        <Controls
          previous={this.previousHandler}
          next={this.nextHandler}
          cancel={this.cancelHandler}
          error={error} />
      </form>
    );
  }
}

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
