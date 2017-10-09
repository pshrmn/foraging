import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Tree from 'components/tree/Tree';
import ElementCard from 'components/ElementCard';
import PageControls from 'components/PageControls';

import { highlight, unhighlight } from 'helpers/markup';
import { currentSelector } from 'constants/CSSClasses';

class Page extends React.Component {
  componentDidMount() {
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

  render() {
    const { params } = this.props;
    return (
      <div className='frame'>
        <h1>Page {params.name}</h1>
        <PageControls params={params} />
        <div className='content'>
          <Tree />
          <ElementCard />
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  params: PropTypes.object.isRequired,
  element: PropTypes.object
};

export default connect(
  state => {
    const { pages, current, elementIndex } = state.page;
    const page = pages.find(p => p.name === current);
    return {
      element: page && page.elements[elementIndex]
    };
  }
)(Page);
