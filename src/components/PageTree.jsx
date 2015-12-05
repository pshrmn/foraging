import React from "react";
import d3 from "d3";

import { PosButton, NegButton, NeutralButton } from "./Inputs";
import { abbreviate, clone, highlight, unhighlight } from "../helpers";

/*
 * A tree rendering of the page, used to show the current page, the current
 * selector, and to select a selector (for editing, adding children, or rules)
 */
export default React.createClass({
  getDefaultProps: function() {
    return {
      selectPage: () => {},
      width: 500,
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
    let { page, selector, active, actions } = this.props;
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
      if ( selector && n.original === selector ) {
        current = true;
      }
      return <Node key={i} 
                   current={current}
                   select={actions.selectSelector}
                   active={active}
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
    let { page, actions,
          width, height, margin } = this.props;
    let nodes = this._makeNodes();
    let pageInfo = page === undefined ? null : (
      <div>
        <h2>{page.name}</h2>
        <PageControls actions={actions}
                      {...page} />
      </div>
    );
    return (
      <div className="graph">
        {pageInfo}    
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
    this.props.select(this.props.original);
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
    return abbreviate(text, 10);
  },
  render: function() {
    let { current, depth, hasRules, children, active } = this.props;
    let hasChildren = children && children.length;
    let empty = !hasRules && !hasChildren;
    let text = this.specText();
    let marker = hasRules ? (
      <rect width="6" height="6" x="-3" y="-3"></rect>
    ) : (
      <circle r="3"></circle>
    );
    let classNames = ["node"];
    if ( current ) {
      classNames.push("current");
    }
    if ( empty ) {
      classNames.push("empty");
    }
    // only apply events when the node is "active"
    let events = active ? {
      onClick: this.handleClick,
      onMouseOver: this.handleMouseover,
      onMouseOut: this.handleMouseout
    } : {};
    return (
      <g className={classNames.join(" ")}
         transform={`translate(${this.props.y},${this.props.x})`}
         {...events} >
        <text y="-10" >{text}</text>
        {marker}
      </g>
    );
  },
  componentWillUnmount: function() {
    unhighlight(this.hoverClass);
  }
});

let PageControls = React.createClass({
  renameHandler: function(event) {
    event.preventDefault();
    let name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \\ / | ? * ");
    // do nothing if the user cancels, does not enter a name, or enter the same name as the current one
    if ( name === null || name === "" || name === this.props.name) {
      return;
    }
    this.props.actions.renamePage(name);
  },
  deleteHandler: function(event) {
    event.preventDefault();
    // report the current page index
    this.props.actions.removePage();
  },
  uploadHandler: function(event) {
    event.preventDefault();
    this.props.actions.uploadPage();
  },
  previewHandler: function(event) {
    event.preventDefault();
    this.props.actions.showPreview();
  },
  render: function() {
    return (
      <div>
        <PosButton click={this.uploadHandler} text="Upload" />
        <PosButton click={this.previewHandler} text="Preview" />
        <PosButton click={this.renameHandler} text="Rename" />
        <NegButton click={this.deleteHandler} text="Delete" />
      </div>
    );
  }
})
