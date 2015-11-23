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
  saveHandler: function(event) {
    event.preventDefault();
    let { parts } = this.state;
    let selector = parts.reduce((str, curr) => {
      if ( curr.checked ) {
        str += curr.name;
      }
      return str;
    }, "");
    if ( selector !== "" ) {
      this.props.actions.showSpecFrame(selector);
    }
  },
  cancelHander: function(event) {
    event.preventDefault();
    this.props.actions.showSelectorFrame();
  },
  toggleRadio: function(event) {
    // don't prevent default
    let index = event.target.value;
    let parts = this.state.parts;
    parts[index].checked = !parts[index].checked;
    let fullSelector = parts.reduce((str, curr) => {
      if ( curr.checked ) {
        str += curr.name;
      }
      return str;
    }, "");

    let eleCount = fullSelector === "" ? 0 : count(this.props.selector.elements, fullSelector);
    this._setupHighlights(fullSelector);
    this.setState({
      parts: parts,
      eleCount: eleCount
    });
  },
  componentWillMount: function() {
    let names = this.props.data.parts;
    let parts = names.map(name => {
      return {
        name: name,
        checked: true
      }
    });
    let fullSelector = names.join("");
    let eleCount = count(this.props.selector.elements, fullSelector);
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
          <h3>Parts:</h3>
          <div className="choices">
            {opts}
          </div>
          <h5>Count: {this.state.eleCount}</h5>
        </div>
        <div className="buttons">
          <PosButton text="Save" click={this.saveHandler} />
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
      let elements = select(this.props.selector.elements, cssSelector);
      highlight(elements, this.previewClass);
    }
  }
});
