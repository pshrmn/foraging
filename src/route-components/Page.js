import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Tree from 'components/tree/Tree';
import ElementCard from 'components/ElementCard';
import PageControls from 'components/PageControls';

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
    this.setState({
      index,
      element: this.props.page.elements[index]
    });
  }

  componentDidMount() {
    selectPage(this.props.page);

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
    const { response: { params } } = this.props;
    if (!this.props.page) {
      return null;
    }
    return (
      <div className='frame'>
        <h1>Page {params.name}</h1>
        <PageControls params={params} />
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
    return {
      response: state.response,
      page
    };
  }
)(Page);
