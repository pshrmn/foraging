import React from 'react';
import { connect } from 'react-redux';
import { hierarchy, tree } from 'd3-hierarchy';
import { path } from 'd3-path';

import { shortElement } from 'helpers/text';
import { simpleGrow } from 'helpers/page';
import { highlight, unhighlight } from 'helpers/markup';
import { selectElement } from 'actions';
import { savedPreview } from 'constants/CSSClasses';

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
  }

  componentWillMount() {
    const { width, height } = this.props;
    this.setState({
      // tree layout
      tree: tree().size([height, width])
    });
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
      <Node key={i}
            current={n.index === elementIndex}
            select={selectElement}
            active={active}
            {...n} />
    );
    // each link has a source and a target
    const links = treeRoot.links().map((link, i) =>
      <path key={i}
            className='link'
            d={drawLink(link)} />
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
          className={active ? null : 'not-allowed'} >
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
  width: React.PropTypes.number,
  height: React.PropTypes.number,
  page: React.PropTypes.object.isRequired,
  elementIndex: React.PropTypes.number.isRequired,
  active: React.PropTypes.bool,
  selectElement: React.PropTypes.func.isRequired
};

class Node extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseover = this.handleMouseover.bind(this);
    this.handleMouseout = this.handleMouseout.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.props.select(this.props.data.index);
  }

  handleMouseover() {
    highlight(this.props.data.matches, savedPreview);
  }

  handleMouseout() {
    unhighlight(savedPreview);
  }

  render() {
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
  }

  componentWillUnmount() {
    unhighlight(savedPreview);
  }
}

Node.propTypes = {
  select: React.PropTypes.func.isRequired,
  data: React.PropTypes.object.isRequired,
  current: React.PropTypes.bool,
  active: React.PropTypes.bool,
  children: React.PropTypes.array,
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired
};

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
