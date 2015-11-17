import React from "react";
import d3 from "d3";

import { abbreviate } from "../helpers";

/*
 * A tree rendering of the page, used to show the current page, the current
 * selector, and to select a selector (for editing, adding children, or rules)
 */
export default React.createClass({
  getDefaultProps: function() {
    return {
      selectPage: () => {},
      width: 300,
      height: 150,
      margin: {
        top: 25,
        right: 25,
        bottom: 25,
        left: 50
      }
    };
  },
  getInitialState: function() {
    return {
      diagonal: d3.svg.diagonal().projection(d => { return [d.y, d.x]; })
    };
  },
  componentWillMount: function() {
    this._makeTreeLayout(this.props.width, this.props.height);
  },
  componentWillReceiveProps: function(nextProps) {
    let { width, height } = nextProps;
    if ( width !== this.props.width || height !== this.props.height ) {
      this._makeTreeLayout(width, height);
    }
  },
  _makeTreeLayout: function(width, height) {
    let tree = d3.layout.tree()
      .size([height, width]);
    this.setState({
      tree: tree
    });
  },
  _makeNodes: function() {
    // don't draw anything when there isn't a page
    let { page, actions } = this.props;
    let { selectSelector } = actions;
    if ( page === undefined ) {
      return null;
    }

    let { tree, diagonal } = this.state;

    // generate the tree's nodes and links
    let nodes = tree.nodes(page);
    let links = tree.links(nodes);
    let paths = links.map((l, i) => {
      return <path key={i}
                   className="link"
                   d={diagonal(l)} />
    });

    let selectors = nodes.map((n, i) => {
      return <Node key={i} 
                   select={selectSelector}
                   {...n} />
    });

    return (
      <g>
        {paths}
        {selectors}
      </g>
    );
  },
  render: function() {
    let { width, height, margin } = this.props;
    let nodes = this._makeNodes();

    return (
      <div className="graph">
        <svg width={margin.left+width+margin.right}
             height={margin.top+height+margin.bottom}>
          <g transform={`translate(${margin.left},${margin.top})`} >
            {nodes}
          </g>
        </svg>
      </div>
    );
  }
});

let Node = React.createClass({
  handleClick: function(event) {
    event.preventDefault();
    this.props.select(this.props.id);
  },
  specText: function(spec, selector) {
    let text = "";
    if ( !spec ) {
      return text;
    }
    switch ( spec.type ) {
    case "single":
        text = `${selector}[${spec.value}]`;
        break;
    case "all":
        text = `[${selector}]`;
        break;
    }
    return abbreviate(text, 15);
  },
  render: function() {
    let { selector, spec, rules, x, y } = this.props;
    let text = this.specText(spec, selector);
    let marker = rules && rules.length ? (
      <rect width="6" height="6" x="-3" y="-3"></rect>
    ) : (
      <circle r="3"></circle>
    );

    return (
      <g className="node" onClick={this.handleClick} transform={`translate(${y},${x})`}>
        <text y="5" dx="-5">{text}</text>
        {marker}
      </g>
    );
  }
});
