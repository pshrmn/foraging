import React from "react";
import { connect } from "react-redux";

import { PosButton, NegButton } from "../common/Buttons";

import { select, count } from "../../helpers/selection";
import { highlight, unhighlight} from "../../helpers/markup";
import { showMessage } from "expiring-redux-messages";
import { showSpecFrame, showElementFrame } from "../../actions";

const PartsFrame = React.createClass({
  previewClass: "query-check",
  getInitialState: function() {
    return {
      parts: [],
      eleCount: 0
    };
  },
  nextHandler: function(event) {
    event.preventDefault();
    const { parts } = this.state;
    const selector = this.joinParts(parts);
    if ( selector !== "" ) {
      this.props.next(selector);
    } else {
      this.props.showMessage("No selectors parts selected", 5000, -1);
    }
  },
  cancelHander: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  toggleRadio: function(event) {
    // don't prevent default
    const index = event.target.value;
    const parts = this.state.parts;
    parts[index].checked = !parts[index].checked;
    const fullSelector = this.joinParts(parts);

    this._setupHighlights(fullSelector);
    this.setState({
      parts: parts,
      eleCount: fullSelector === "" ? 0 : count(this.props.parentElements, fullSelector)
    });
  },
  joinParts: parts => {
    return parts.reduce((str, curr) => {
      if ( curr.checked ) {
        str += curr.name;
      }
      return str;
    }, "");
  },
  componentWillMount: function() {
    const names = this.props.parts;
    // by default, each css selector part should be checked
    const parts = names.map(name => {
      return {
        name: name,
        checked: true
      }
    });
    const fullSelector = names.join("");
    this._setupHighlights(fullSelector);
    this.setState({
      parts: parts,
      eleCount: count(this.props.parentElements, fullSelector)
    });
  },
  render: function() {
    const { parts, eleCount } = this.state;
    const opts = parts.map((part, index) => {
      const { name, checked } = part;
      return (
        <label key={index}
               className={checked ? "selected" : ""}>
          {name}
          <input type="checkbox"
                 name="selector-part"
                 value={index}
                 checked={checked}
                 onChange={this.toggleRadio} />
        </label>
      );
    });
    return (
      <div className="frame parts-form">
        <div className="info">
          <h3>Select Relevant Parts of the CSS selector</h3>
          <div className="choices">
            {opts}
          </div>
          <h5>Count: {this.state.eleCount}</h5>
        </div>
        <div className="buttons">
          <PosButton text="Next" click={this.nextHandler} />
          <NegButton text="Cancel" click={this.cancelHander} />
        </div>
      </div>
    );
  },
  componentWillUnmount: function() {
    unhighlight(this.previewClass);
  },
  _setupHighlights: function(cssSelector) {
    unhighlight(this.previewClass);
    if ( cssSelector !== "" ) {
      const elements = select(this.props.parentElements, cssSelector);
      highlight(elements, this.previewClass);
    }
  }
});

export default connect(
  state => {
    const { page } = state;
    const { pages, pageIndex, elementIndex } = page;
    const currentPage = pages[pageIndex];
    const element = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
    const parentElements = element.elements || [];
    return {
      parentElements: element.elements,
      ...state.frame.data
    }
  },
  {
    next: showSpecFrame,
    cancel: showElementFrame,
    showMessage 
  }
)(PartsFrame);
