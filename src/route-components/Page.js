import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Tree from 'components/tree/Tree';
import ElementCard from 'components/card/ElementCard';

import { currentPage } from 'helpers/store';
import { selectPage } from 'helpers/selection';
import { highlight, unhighlight } from 'helpers/markup';
import { currentSelector } from 'constants/CSSClasses';

class Page extends React.Component {
  constructor(props) {
    super(props);

    const { query } = props.response.location;
    const index = query.element || 0;

    this.state = {
      index,
      element: this.props.page.elements[index]
    };
  }

  select = (index) => {
    if (index === this.state.index) {
      return;
    }
    this.setState({
      index,
      element: this.props.page.elements[index]
    });
  }

  componentDidMount() {
    unhighlight(currentSelector);
    if ( this.state.element ) {
      highlight(this.state.element.matches, currentSelector);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    unhighlight(currentSelector);
    if ( this.state.element !== undefined && this.state.element !== prevState.element ) {
      highlight(this.state.element.matches, currentSelector);
    }
  }

  componentWillUnmount() {
    unhighlight(currentSelector);
  }

  render() {
    if (!this.props.page) {
      return null;
    }
    return (
      <div className='frame'>
        <div className='content'>
          <Tree current={this.state.index} select={this.select} />
          <ElementCard
            index={this.state.index}
            page={this.props.page}
            select={this.select}
          />
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  response: PropTypes.object.isRequired,
  page: PropTypes.object
};

export default connect(
  state => {
    const page = currentPage(state);
    if (page) {
      selectPage(page);
    }
    return {
      response: state.response,
      page
    };
  }
)(Page);
