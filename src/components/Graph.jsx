import React from "react";
import d3 from "d3";

import { abbreviate, clone, highlight, unhighlight } from "../helpers";

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
    let { page, selector, selectSelector } = this.props;
    if ( page === undefined ) {
      return null;
    }

    let { tree, diagonal } = this.state;

    let clonedPage = clone(page);

    // generate the tree's nodes and links
    let nodes = tree.nodes(clonedPage);
    let links = tree.links(nodes);
    let paths = links.map((l, i) => {
      return <path key={i}
                   className="link"
                   d={diagonal(l)} />
    });

    let selectors = nodes.map((n, i) => {
      let current = false;
      if ( selector && n.id === selector.id ) {
        current = true;
      }
      return <Node key={i} 
                   current={current}
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
  hoverClass: "saved-preview",
  handleClick: function(event) {
    event.preventDefault();
    this.props.select(this.props.id);
  },
  handleMouseover: function(event) {
    highlight(this.props.elements, this.hoverClass);
  },
  handleMouseout: function(event) {
    unhighlight(this.hoverClass);
  },
  specText: function() {
    let { selector, spec } = this.props;
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
    let { rules, children } = this.props;
    let hasChildren = children && children.length;
    let hasRules = rules && rules.length;
    let text = this.specText();
    let marker = rules && rules.length ? (
      <rect width="6" height="6" x="-3" y="-3"></rect>
    ) : (
      <circle r="3"></circle>
    );
    let classNames = ["node"];
    if ( this.props.current ) {
      classNames.push("current");
    }
    if ( !hasRules && !hasChildren ) {
      classNames.push("empty");
    }
    return (
      <g className={classNames.join(" ")}
         transform={`translate(${this.props.y},${this.props.x})`}
         onClick={this.handleClick}
         onMouseOver={this.handleMouseover}
         onMouseOut={this.handleMouseout} >
        <text y="5" dx="-5">{text}</text>
        {marker}
      </g>
    );
  }
});
