import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hierarchy, tree } from 'd3-hierarchy';
import { path } from 'd3-path';

import Node from './Node';
import { simpleGrow } from 'helpers/page';
import { selectElement } from 'actions';

// d3 dropped svg.diagonal, but this is the equivalent path function
// https://github.com/d3/d3-shape/issues/27#issuecomment-227839157
function drawLink(node) {
  const context = path();
  const { source, target } = node;
  context.moveTo(target.y, target.x);
  context.bezierCurveTo(
    (target.y + source.y)/2, target.x,
    (target.y + source.y)/2, source.x,
    source.y, source.x
  );
  return context.toString();
}

class Tree extends React.Component {
  constructor(props) {
    super(props);
    this._makeNodes = this._makeNodes.bind(this);

    const { width, height } = this.props;
    this.state = {
      tree: tree().size([height, width])
    };
  }

  _makeNodes() {
    const { page, elementIndex, active, selectElement } = this.props;
    const { tree } = this.state;

    // clone the page data so that data isn't interfered with
    // this might not be necessary with d3 v4 since all of the
    // data is moved to a data object.
    const clonedPage = simpleGrow(page.elements);
    // hierarchy sets up the nested information
    const treeRoot = hierarchy(clonedPage);
    // determine the layout of the tree
    tree(treeRoot);
    // descendants is all of the nodes in the tree
    // we draw a node for each node
    const nodes = treeRoot.descendants().map((n, i) =>
      <Node
        key={i}
        current={n.data.index === elementIndex}
        select={selectElement}
        active={active}
        {...n}
      />
    );
    // each link has a source and a target
    const links = treeRoot.links().map((link, i) =>
      <path key={i}
        className='link'
        d={drawLink(link)}
      />
    );

    return (
      <g transform='translate(50,25)' >
        <g className='links'>
          { links }
        </g>
        <g className='nodes'>
          { nodes }
        </g>
      </g>
    );
  }

  render() {
    if ( this.props.page === undefined ) {
      return null;
    }
    const { width, height, active } = this.props;
    /*
     * The tree layout places the left and right-most nodes directly on the edge,
     * so additional space needs to be granted so that the labels aren't cut off.
     * In this case, a left and right margin of 50 is used by expanding with width
     * by 100 and translating the tree 50 pixels to the right
     */
    return (
      <div className='tree'>
        <svg
          width={width+100}
          height={height+50}
          className={active ? null : 'not-allowed'}
        >
          {this._makeNodes()}
        </svg>
      </div>
    );
  }
}

Tree.defaultProps = {
  width: 400,
  height: 150
};

Tree.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  page: PropTypes.object,
  elementIndex: PropTypes.number.isRequired,
  active: PropTypes.bool,
  selectElement: PropTypes.func.isRequired
};

export default connect(
  state => {
    const { response, page } = state;
    const { name } = response.params;
    const { pages, elementIndex } = page;
    const currentPage = pages.find(p => p.name === name);
    return {
      page: currentPage,
      active: response.name === 'Page',
      elementIndex
    };
  },
  {
    selectElement,
  }
)(Tree);
