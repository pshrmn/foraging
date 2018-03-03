import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/*
 * This component places the Curi config object and the
 * current response object on the context, which makes them
 * available to any components that use the context to
 * access them.
 */
class CuriProvider extends React.Component {
  getChildContext() {
    return {
      curi: this.props.curi,
      curiResponse: this.props.response
    };
  }

  render() {
    return this.props.children;
  }
}

CuriProvider.propTypes = {
  response: PropTypes.object,
  curi: PropTypes.object,
  children: PropTypes.any
};

CuriProvider.childContextTypes = {
  curi: PropTypes.object,
  curiResponse: PropTypes.object
};

export default connect(
  state => ({ curi: state.curi, response: state.response })
)(CuriProvider);
