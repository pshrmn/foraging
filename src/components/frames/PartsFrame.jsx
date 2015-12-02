import React from "react";

import { PosButton, NegButton } from "../Inputs";
import { select, count, highlight, unhighlight} from "../../helpers";

export default React.createClass({
  previewClass: "query-check",
  getInitialState: function() {
    return {
      parts: [],
      eleCount: 0
    };
  },
  nextHandler: function(event) {
    event.preventDefault();
    let { parts } = this.state;
    let selector = this.joinParts(parts);
    if ( selector !== "" ) {
      this.props.next(selector);
    }
  },
  cancelHander: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  toggleRadio: function(event) {
    // don't prevent default
    let index = event.target.value;
    let parts = this.state.parts;
    parts[index].checked = !parts[index].checked;
    let fullSelector = this.joinParts(parts);

    let eleCount = fullSelector === "" ? 0 : count(this.props.parentElements, fullSelector);
    this._setupHighlights(fullSelector);
    this.setState({
      parts: parts,
      eleCount: eleCount
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
    let names = this.props.parts;
    // by default, each css selector part should be checked
    let parts = names.map(name => {
      return {
        name: name,
        checked: true
      }
    });
    let fullSelector = names.join("");
    let eleCount = count(this.props.parentElements, fullSelector);
    this._setupHighlights(fullSelector);
    this.setState({
      parts: parts,
      eleCount: eleCount
    });
  },
  render: function() {
    let { parts, eleCount } = this.state;
    let opts = parts.map((part, index) => {
      let { name, checked } = part;
      let labelClass = checked ? "selected" : "";
      return (
        <label key={index}
               className={labelClass} >
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
      let elements = select(this.props.parentElements, cssSelector);
      highlight(elements, this.previewClass);
    }
  }
});
