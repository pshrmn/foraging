import React from 'react';
import { connect } from 'react-redux';
import { hierarchy, tree } from 'd3-hierarchy';

import { shortElement } from 'helpers/text';
import { simpleGrow } from 'helpers/page';
import { highlight, unhighlight } from 'helpers/markup';
import { selectElement } from 'actions';
import { savedPreview } from 'constants/CSSClasses';

// d3 dropped svg.diagonal, but this is the equivalent path function
// https://github.com/d3/d3-shape/issues/27#issuecomment-227839157
function linkPath(d) {
  return "M" + d.y + "," + d.x
      + "C" + (d.y + d.parent.y) / 2 + "," + d.x
      + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
      + " " + d.parent.y + "," + d.parent.x;
}

const Tree = React.createClass({
  getDefaultProps: function() {
    return {
      width: 400,
      height: 150
    };
  },
  componentWillMount: function() {
    const { width, height } = this.props;
    this.setState({
      // tree layout
      tree: tree().size([height, width])
    });
  },
  _makeNodes: function() {
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
    const descendants = treeRoot.descendants();
    // we draw a node for each node
    const nodes = descendants.map((n, i) =>
      <Node key={i} 
            current={n.index === elementIndex}
            select={selectElement}
            active={active}
            {...n} />
    );
    // but the root node doesn't have a link
    // (links are drawn from child to parent)
    const links = descendants.slice(1).map((link, i) => 
      <path key={i}
            className='link'
            d={linkPath(link)} />
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
  },  
  render: function() {
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
          className={active ? null : 'not-allowed'} >
          {this._makeNodes()}
        </svg>
      </div>
    );
  }
});

const Node = React.createClass({
  handleClick: function(event) {
    event.preventDefault();
    this.props.select(this.props.data.index);
  },
  handleMouseover: function(event) {
    highlight(this.props.data.matches, savedPreview);
  },
  handleMouseout: function(event) {
    unhighlight(savedPreview);
  },
  render: function() {
    const {
      current,
      data,
      active,
      children,
      x,
      y
    } = this.props;
    const {
      hasRules,
      selector,
      spec,
      optional
    } = data;
    const empty = !hasRules && !(children && children.length);

    // nodes with rules drawn as rect, nodes with no rules drawn as circles
    const marker = hasRules ? (
      <rect width='6' height='6' x='-3' y='-3'></rect>
    ) : (
      <circle r='3'></circle>
    );

    const classNames = [
      'node',
      current ? 'current' : null,
      empty ? 'empty' : null
    ];
    // only apply events when the node is 'active'
    const events = active ? {
      onClick: this.handleClick,
      onMouseOver: this.handleMouseover,
      onMouseOut: this.handleMouseout
    } : {};
    return (
      <g
        className={classNames.join(' ')}
        transform={`translate(${y},${x})`}
        {...events} >
        <text y='-10'>
          {shortElement(selector, spec, optional)}
        </text>
        {marker}
      </g>
    );
  },
  componentWillUnmount: function() {
    unhighlight(savedPreview);
  }
});

export default connect(
  state => {
    const { page, frame } = state;
    const { pages, pageIndex, elementIndex } = page;
    const currentPage = pages[pageIndex];
    return {
      page: currentPage,
      active: frame.name === 'element',
      elementIndex
    };
  },
  {
    selectElement,
  }
)(Tree);
