import React from "react";
import d3 from "d3";

import { PosButton, NegButton, NeutralButton } from "./Buttons";
import { abbreviate } from "../helpers/text";
import { clone } from "../helpers/page";
import { highlight, unhighlight } from "../helpers/markup";
import { chromeDelete } from "../helpers/chrome";

/*
 * A tree rendering of the page, used to show the current page, the current
 * element, and to select an element (for editing, adding children, or rules)
 */
export default React.createClass({
  getDefaultProps: function() {
    return {
      width: 500,
      height: 150
    };
  },
  getInitialState: function() {
    return {
      diagonal: d3.svg.diagonal().projection(d => [d.y, d.x])
    };
  },
  componentWillMount: function() {
    const { width, height } = this.props;
    this.setState({
      tree: d3.layout.tree().size([height, width])
    });
  },
  _makeNodes: function() {
    const { page, element, active, actions } = this.props;
    const { tree, diagonal } = this.state;

    // clone the page since it overwrites children
    const clonedPage = clone(page.element);

    // generate the tree's nodes and links
    const nodes = tree.nodes(clonedPage);
    const links = tree.links(nodes);

    return (
      <g>
        {
          links.map((link, i) => {
            return <path key={i}
                         className="link"
                         d={diagonal(link)} />
          })
        }
        {
          nodes.map((n, i) => {
            return <Node key={i} 
                         current={element !== undefined && n.original === element}
                         select={actions.selectElement}
                         active={active}
                         {...n} />
          })
        }
      </g>
    );
  },
  render: function() {
    const { page, actions, width, height } = this.props;
    // return an empty .graph when there is no page
    if ( page === undefined ) {
      return <div className="graph"></div>
    }
    /*
     * The tree layout places the left and right-most nodes directly on the edge,
     * so additional space needs to be granted so that the labels aren't cut off.
     * In this case, a left and right margin of 50 is used by expanding with width
     * by 100 and translating the tree 50 pixels to the right
     */
    return (
      <div className="graph">
        <div>
          <h2>{page.name}</h2>
          <PageControls actions={actions}
                        {...page} />
        </div>
        <svg width={width+100}
             height={height+50}>
          <g transform="translate(50,25)" >
            {this._makeNodes()}
          </g>
        </svg>
      </div>
    );
  }
});

const Node = React.createClass({
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
    const { selector, spec } = this.props;
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
    const { current, hasRules, children, active } = this.props;
    const empty = !hasRules && !(children && children.length);
    const text = this.specText();
    // nodes with rules drawn as rect, nodes with no rules drawn as circles
    const marker = hasRules ? (
      <rect width="6" height="6" x="-3" y="-3"></rect>
    ) : (
      <circle r="3"></circle>
    );

    const classNames = ["node"];
    classNames.push(current ? "current" : null);
    classNames.push(empty ? "empty" : null);
    // only apply events when the node is "active"
    const events = active ? {
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

/*
 * PageControls
 * ------------
 *
 * Interact with the Page to upload it to a server, preview what the Page would capture
 * on the current web page, rename the Page, and delete it.
 */
const PageControls = React.createClass({
  renameHandler: function(event) {
    event.preventDefault();
    const name = window.prompt("Page Name:\nCannot contain the following characters: < > : \" \\ / | ? * ");
    // do nothing if the user cancels, does not enter a name, or enter the same name as the current one
    if ( name === null || name === "" || name === this.props.name) {
      return;
    }
    this.props.actions.renamePage(name);
  },
  deleteHandler: function(event) {
    event.preventDefault();
    if ( !confirm(`Are you sure you want to delete the page "${this.props.name}"?`)) {
      return;
    }
    chromeDelete(this.props.name);
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
