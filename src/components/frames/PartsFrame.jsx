import React from "react";

import { PosButton, NegButton } from "../Inputs";
import { select, highlight, unhighlight} from "../../helpers";

export default React.createClass({
  previewClass: "query-check",
  getInitialState: function() {
    return {
      parts: [],
      selector: ""
    };
  },
  saveHandler: function(event) {
    event.preventDefault();
    let { selector } = this.state;
    
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
    this._setupHighlights(fullSelector);
    this.setState({
      parts: parts,
      selector: fullSelector
    });
  },
  componentWillMount: function() {
    this._partsArray(this.props.data.parts);
  },
  componentWillReceiveProps: function(nextProps) {
    this._partsArray(nextProps.data.parts);
  },
  componentWillUnmount: function() {
    this._removeHighlights();
  },
  _partsArray: function(names) {
    let parts = names.map(name => {
      return {
        name: name,
        checked: true
      }
    });
    let fullSelector = names.join("");
    this._setupHighlights(fullSelector);
    this.setState({
      parts: parts,
      selector: fullSelector
    });
  },
  render: function() {
    let parts = this.state.parts.map((part, index) => {
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
        <div className="choices">
          {parts}
        </div>
        <div className="buttons">
          <PosButton text="Save" click={this.saveHandler} />
          <NegButton text="Cancel" click={this.cancelHander} />
        </div>
      </div>
    );
  },
  _setupHighlights: function(cssSelector) {
    unhighlight(this.previewClass);
    if ( cssSelector !== "" ) {
      let elements = select(this.props.selector.elements, cssSelector);
      highlight(elements, this.previewClass);
    }
  },
  _removeHighlights: function() {
    unhighlight(this.previewClass);
  }
});
