import React from 'react';
import PropTypes from 'prop-types';

import Controls from 'components/common/StepControls';

import { select } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { currentSelector } from 'constants/CSSClasses';

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
    const { spec, optional } = startData;
    save({
      optional,
      spec
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
    const { selector, spec, optional } = startData;
    return (
      <form className='info-box'>
        <h2>Confirm Updated Element</h2>
        <ul>
          <li>Selector: {selector}</li>
          <li>Spec: {JSON.stringify(spec, null, '\t')}</li>
          <li>Optional: {optional ? 'Yes' : 'No'}</li>
        </ul>
        <Controls
          previous={this.previousHandler}
          next={this.saveHandler}
          nextText='Update'
          cancel={this.cancelHandler}
        />
      </form>
    );
  }

  componentDidMount() {
    const { startData, staticData } = this.props;
    const { spec } = startData;
    const { parent = {} } = staticData;
    const { matches: parentMatches = [document] } = parent;
    const elements = select(
      parentMatches,
      startData.selector,
      spec,
      '.forager-holder'
    );
    highlight(elements, currentSelector);
  }

  componentWillUnmount() {
    unhighlight(currentSelector);
  }
}

ConfirmElement.propTypes = {
  startData: PropTypes.object,
  endData: PropTypes.object,
  staticData: PropTypes.object,
  next: PropTypes.func,
  previous: PropTypes.func,
  cancel: PropTypes.func
};

export default ConfirmElement;
