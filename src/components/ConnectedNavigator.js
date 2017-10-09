import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class ConnectedNavigator extends React.Component {
  getChildContext() {
    return {
      curi: this.props.config,
      curiResponse: this.props.response
    };
  }

  render() {
    return this.props.children;
  }
}

ConnectedNavigator.propTypes = {
  response: PropTypes.object,
  config: PropTypes.object,
  children: PropTypes.any
};

ConnectedNavigator.childContextTypes = {
  curi: PropTypes.object,
  curiResponse: PropTypes.object
};

export default connect(
  state => {
    return {
      response: state.response
    };
  }
)(ConnectedNavigator);
