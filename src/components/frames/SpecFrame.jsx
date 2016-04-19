import React from "react";
import { connect } from "react-redux";

import { PosButton, NegButton } from "../common/Buttons";
import NoSelectMixin from "../NoSelectMixin";

import { createElement } from "../../helpers/page";
import { allSelect, count, select } from "../../helpers/selection";
import { highlight, unhighlight } from "../../helpers/markup";
import { showMessage } from "expiring-redux-messages";
import { saveElement, showElementFrame } from "../../actions";

const SpecFrame = React.createClass({
  highlight: "query-check",
  getInitialState: function() {
    return {
      type: "single",
      value: 0,
      optional: false
    };
  },
  saveHandler: function(event) {
    event.preventDefault();
    const { type, value, optional } = this.state;
    const { css, parent, message, save } = this.props;
    // all value must be set
    if ( type === "all" && value === "" ) {
      message("Name for type \"all\" elements cannot be empty");
      return;
    }
    const ele = createElement(css, type, value, optional);
    ele.elements = select(parent.elements, ele.selector, ele.spec);

    save(ele);
    return;
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  setSpec: function(type, value) {
    this.setState({
      type: type,
      value: value
    });
  },
  toggleOptional: function(event) {
    this.setState({
      optional: event.target.checked
    });
  },
  render: function() {
    const { parent, css } = this.props;
    const elementCount = count(parent.elements, css);
    return (
      <div className="frame spec-form">
        <div className="info">
          <div className="line">
            CSS Selector: {css}
          </div>
          <SpecForm count={elementCount}
                    setSpec={this.setSpec}/>
          <div className="line">
            <label>
              Optional: <input type="checkbox"
                               checked={this.state.optional}
                               onChange={this.toggleOptional} />
            </label>
          </div>
        </div>
        <div className="buttons">
          <PosButton text="Save" click={this.saveHandler} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
  },
  componentWillMount: function() {
    const elements = select(
      this.props.parent.elements,
      this.props.css, {
      type: this.state.type,
      value: this.state.value
    });
    highlight(elements, this.highlight);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(this.highlight);
    const elements = select(
      nextProps.parent.elements,
      nextProps.css, {
      type: nextState.type,
      value: nextState.value
    });
    highlight(elements, this.highlight);
  },
  componentWillUnmount: function() {
    unhighlight(this.highlight);
  }
});

const SpecForm = React.createClass({
  mixins: [NoSelectMixin],
  getInitialState: function() {
    return {
      type: "single",
      value: 0
    };
  },
  setType: function(event) {
    const type = event.target.value;
    let value;
    if ( type === "single" ) {
      value = 0;
    } else if ( type === "all" ) {
      value = "";
    }
    this.props.setSpec(type, value);
    this.setState({
      type: type,
      value: value
    });
  },
  setValue: function(event) {
    let value = event.target.value;
    if ( this.state.type === "single" ) {
      value = parseInt(value, 10);
    }
    this.setSpec(this.state.type, value);
    this.setState({
      value: value
    });
  },
  setSpec: function(type, value) {
    this.props.setSpec(type, value);
  },
  _singleValue: function() {
    const { value } = this.state;
    const options = Array.from(new Array(this.props.count)).map((u, i) => {
      return (
        <option key={i} value={i}>{i}</option>
      );
    });
    return (
      <select value={value}
              onChange={this.setValue} >
        {options}
      </select>
    );
  },
  _allValue: function() {
    return (
      <input type="text"
             value={this.state.value}
             onChange={this.setValue} />
    );
  },
  render: function() {
    const valueChooser = this.state.type === "single" ? this._singleValue() : this._allValue();
    return (
      <div ref="parent">
        <div className="line">
          Type:
          <label>single <input type="radio"
                               name="type"
                               value="single"
                               checked={this.state.type === "single"}
                               onChange={this.setType} />
          </label>
          <label>all <input type="radio"
                               name="type"
                               value="all"
                               checked={this.state.type === "all"}
                               onChange={this.setType} />
          </label>
        </div>
        <div className="line">
          Value: {valueChooser}
        </div>
      </div>
    );
  }
});

export default connect(
  state => {
    const { page } = state;
    const { pages, pageIndex, elementIndex } = page;
    const currentPage = pages[pageIndex];
    const element = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
    return {
      parent: element,
      ...state.frame.data
    };
  },
  {
    save: saveElement,
    cancel: showElementFrame,
    message: showMessage
  }
)(SpecFrame);
