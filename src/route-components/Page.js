import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Tree from 'components/tree/Tree';
import ElementCard from 'components/ElementCard';
import PageControls from 'components/PageControls';

import { currentPage } from 'helpers/store';
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
    return (
      <div className='frame'>
        <h1>Page {params.name}</h1>
        <PageControls params={params} />
        <div className='content'>
          <Tree current={this.state.index} select={this.select} />
          <ElementCard
            element={this.state.element}
            page={this.props.page}
            params={params}
            index={this.state.index}
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
