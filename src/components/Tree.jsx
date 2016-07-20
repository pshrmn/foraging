import React from 'react';
import { connect } from 'react-redux';
import d3 from 'd3';

import { shortElement } from 'helpers/text';
import { simpleGrow } from 'helpers/page';
import { highlight, unhighlight } from 'helpers/markup';
import { selectElement } from 'actions';
import { savedPreview } from 'constants/CSSClasses';

const Tree = React.createClass({
  getDefaultProps: function() {
    return {
      width: 400,
      height: 150
    };
  },
  getInitialState: function() {
    return {
      // used to draw link paths
      diagonal: d3.svg.diagonal().projection(d => [d.y, d.x])
    };
  },
  componentWillMount: function() {
    const { width, height } = this.props;
    this.setState({
      // tree layout
      tree: d3.layout.tree().size([height, width])
    });
  },
  _makeNodes: function() {
    const { page, elementIndex, active, selectElement } = this.props;
    const { tree, diagonal } = this.state;

    const clonedPage = simpleGrow(page.elements);

    // generate the tree's nodes and links
    const nodes = tree.nodes(clonedPage);
    const links = tree.links(nodes);

    return (
      <g transform='translate(50,25)' >
        <g className='links'>
          {
            links.map((link, i) => {
              return <path key={i}
                           className='link'
                           d={diagonal(link)} />
            })
          }
        </g>
        <g className='nodes'>
          {
            nodes.map((n, i) => <Node
              key={i} 
              current={n.index === elementIndex}
              select={selectElement}
              active={active}
              {...n} />
            )
          }
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
    this.props.select(this.props.index);
  },
  handleMouseover: function(event) {
    highlight(this.props.matches, savedPreview);
  },
  handleMouseout: function(event) {
    unhighlight(savedPreview);
  },
  render: function() {
    const {
      current,
      hasRules,
      children,
      active,
      selector,
      spec,
      optional
    } = this.props;
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
        transform={`translate(${this.props.y},${this.props.x})`}
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
