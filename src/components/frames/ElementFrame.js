import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Tree from 'components/Tree';
import ElementCard from 'components/ElementCard';

import { highlight, unhighlight } from 'helpers/markup';
import { currentElement } from 'helpers/store';
import { currentSelector } from 'constants/CSSClasses';

class ElementFrame extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { element } = this.props;
    if ( element === undefined ) {
      return <div className='frame'></div>;
    }

    return (
      <div className='frame'>
        <Tree />
        <ElementCard element={element} active={true} />
      </div>
    );
  }

  componentWillMount() {
    unhighlight(currentSelector);
    if ( this.props.element ) {
      highlight(this.props.element.matches, currentSelector);
    }
  }

  componentWillReceiveProps(nextProps) {
    unhighlight(currentSelector);
    if ( nextProps.element !== undefined && nextProps.element !== this.props.element ) {
      highlight(nextProps.element.matches, currentSelector);
    }
  }

  componentWillUnmount() {
    unhighlight(currentSelector);
  }
}

ElementFrame.propTypes = {
  element: PropTypes.object
};

export default connect(
  state => {
    return {
      element: currentElement(state)
    };
  }
)(ElementFrame);
