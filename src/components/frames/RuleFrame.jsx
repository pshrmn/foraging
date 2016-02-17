import React from "react";
import { connect } from "react-redux";

import { PosButton, NegButton } from "../Buttons";

import { attributes } from "../../helpers/attributes";
import { select } from "../../helpers/selection";
import { abbreviate } from "../../helpers/text";
import { highlight, unhighlight } from "../../helpers/markup";
import { saveRule, showElementFrame } from "../../actions";

const RuleFrame = React.createClass({
  highlight: "current-element",
  getInitialState: function() {
    return {
      name: "",
      type: "string",
      attr: "",
      elementIndex: 0
    };
  },
  setName: function(event) {
    this.setState({
      name: event.target.value
    });
  },
  setType: function(event) {
    this.setState({
      type: event.target.value
    });
  },
  setAttr: function(attr) {
    this.setState({
      attr: attr
    });
  },
  saveHandler: function(event) {
    event.preventDefault();
    const { name, type, attr } = this.state;
    // basic validation
    if ( name !== "" && attr !== "" ) {
      this.props.save({
        name: name,
        type: type,
        attr: attr
      });
    }
  },
  cancelHandler: function(event) {
    event.preventDefault();
    this.props.cancel();
  },
  render: function() {
    const { element } = this.props;
    const { name, type, attr } = this.state;
    const typeRadios = ["string", "int", "float"].map((t,i) => {
      return (
        <label key={i}>
          <input type="radio"
                 name="rule-type"
                 value={t}
                 checked={t === type}
                 onChange={this.setType} />
          <span className="rule-type">{t}</span>
        </label>
      );
    });
 
    return (
      <div className="frame rule-form">
        <div className="info">
          <div>
            <label>
              Name: <input type="text"
                     value={name}
                     onChange={this.setName} />
            </label>
          </div>
          <div>
            Type: {typeRadios}
          </div>
          <AttrChoices elements={element.elements}
                       attr={attr}
                       setAttr={this.setAttr} />
        </div>
        <div className="buttons">
          <PosButton text="Save" click={this.saveHandler} />
          <NegButton text="Cancel" click={this.cancelHandler} />
        </div>
      </div>
    );
  },
  componentWillMount: function() {
    const { elements } = this.props.element;
    highlight(elements, this.highlight);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(this.highlight);
    const { elements } = nextProps.element;
    highlight(elements, this.highlight);
  },
  componentWillUnmount: function() {
    unhighlight(this.highlight);
  }
});

const AttrChoices = React.createClass({
  getInitialState: function() {
    return {
      index: 0
    };
  },
  nextElement: function(event) {
    const { index } = this.state;
    const eleCount = this.props.elements.length;
    this.setState({
      index: (index+1) % eleCount
    });
  },
  prevElement: function(event) {
    const { index } = this.state;
    const eleCount = this.props.elements.length;
    // JavaScript's modulo of negative numbers stay negative
    this.setState({
      index: (((index-1) % eleCount) + eleCount) % eleCount
    });
  },
  selectAttr: function(event) {
    this.props.setAttr(event.target.value);
  },
  /*
   * return an array of radio inputs, one for each attribute. input is checked
   * if it matches the attr prop
   */
  elementAttributes: function(element) {
    const { attr } = this.props;
    return attributes(element).map((a,i) => {
      return (
        <li key={i}>
          <label>
            <input type="radio"
                   name="rule-attr"
                   value={a.name}
                   checked={a.name === attr }
                   onChange={this.selectAttr} />
            <span className="rule-attr">{a.name}</span> {abbreviate(a.value, 40)}
          </label>
        </li>
      );
    });
  },
  render: function() {
    const { elements, attr } = this.props;
    const { index } = this.state;
    const eleCount = elements.length;
    return (
      <div className="element-attributes">
        <ul>
          {this.elementAttributes(elements[index])}
        </ul>
        <div>
          <PosButton text="<<"
                     classes={["transparent"]}
                     click={this.prevElement} />
          {" "}{index+1}/{eleCount}{" "}
          <PosButton text=">>"
                     classes={["transparent"]}
                     click={this.nextElement} />
        </div>
      </div>
    );
  }
});

export default connect(
  state => ({
    element: state.element
  }),
  {
    save: saveRule,
    cancel: showElementFrame
  }
)(RuleFrame);
