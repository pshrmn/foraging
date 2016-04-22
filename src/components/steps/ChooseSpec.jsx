import React from "react";
import { connect } from "react-redux";

import { PosButton, NegButton } from "../common/Buttons";
import NoSelectMixin from "../NoSelectMixin";

import { createElement } from "../../helpers/page";
import { allSelect, count, select } from "../../helpers/selection";
import { highlight, unhighlight } from "../../helpers/markup";
import { saveElement, showElementFrame } from "../../actions";

const highlightClass = "query-check";

const ChooseSpec = React.createClass({
  getInitialState: function() {
    return {
      type: "single",
      value: 0,
      optional: false,
      error: ""
    };
  },
  saveHandler: function(event) {
    event.preventDefault();
    const { type, value, optional } = this.state;
    const { startData, next: save } = this.props;
    const { selector, current } = startData;
    // all value must be set
    if ( type === "all" && value === "" ) {
      this.setState({
        error: "Name for type \"all\" elements cannot be empty"
      });
      return;
    }
    const ele = createElement(selector, type, value, optional);
    ele.elements = select(current.elements, ele.selector, ele.spec);
    // the next function serves as the save function for this wizard
    // because ChooseSpec is the last step
    save(ele);
    return;
  },
  previousHandler: function(event) {
    event.preventDefault();
    this.props.previous();
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
    const { startData} = this.props;
    const { current, selector } = startData
    const elementCount = count(current.elements, selector);
    return (
      <div className="frame spec-form">
        <div className="info">
          <div className="line">
            CSS Selector: {selector}
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
          <NegButton text="Previous" click={this.previousHandler} />
          <PosButton text="Save" click={this.saveHandler} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
  },
  componentWillMount: function() {
    const { startData } = this.props;
    const { current, selector } = startData;
    const { type, value } = this.state;
    const elements = select(current.elements, selector, {type, value});
    highlight(elements, highlightClass);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(highlightClass);

    const { startData } = nextProps;
    const { current, selector } = startData;
    const { type, value } = nextState;
    const elements = select(current.elements, selector, {type, value});
    highlight(elements, highlightClass);
  },
  componentWillUnmount: function() {
    unhighlight(highlightClass);
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

export default ChooseSpec;
