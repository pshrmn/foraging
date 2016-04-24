import React from "react";
import { connect } from "react-redux";

import NoSelectMixin from "../NoSelectMixin";

import { showElementWizard, removeElement, renameElement,
  showRuleWizard, removeRule, toggleOptional } from "../../actions";
import { PosButton, NegButton, NeutralButton } from "../common/Buttons";
import { highlight, unhighlight } from "../../helpers/markup";
import { currentSelector } from "../../constants/CSSClasses";

const ElementFrame = React.createClass({
  mixins: [NoSelectMixin],
  addChild: function(event) {
    this.props.showElementWizard();
  },
  addRule: function(event) {
    this.props.showRuleWizard();
  },
  remove: function(event) {
    const { element, removeElement } = this.props;
    if ( !confirm(`Are you sure you want to delete the element "${element.selector}"?`)) {
      return;
    }
    removeElement();
  },
  rename: function(event) {
    const newName = window.prompt("New name to save element's array as:");
    if ( newName === null || newName === "" ) {
      return;
    }
    const { element, renameElement } = this.props;
    renameElement(newName);
  },
  removeRule: function(index) {
    const rules = this.props.element.rules;
    this.props.removeRule(index);
  },
  toggleOptional: function(event) {
    this.props.toggleOptional();
  },
  render: function() {
    const { element } = this.props;
    if ( element === undefined ) {
      return null;
    }

    const {
      selector,
      rules,
      spec,
      optional = false
    } = element;
    const {
      type = "single",
      value = 0
    } = spec;

    let description = "";

    if ( type === "single" ) {
      description = `element at index ${value}`;
    } else if ( type === "all" ) {
      description = `all elements, stores them as "${value}"`;
      
    }
    const renameButton = type === "all" ? <NeutralButton text="Rename" click={this.rename} /> : null;
    return (
      <div className="frame" ref="parent">
        <div className="info">
          <div>
            Selector: <span className="big bold">{selector}</span>
          </div>
          <div>
            Captures: {description}
          </div>
          <div>
            Optional: <input type="checkbox" checked={optional} onChange={this.toggleOptional} />
          </div>
          <RuleList rules={rules}
                    remove={this.removeRule} />
        </div>
        <div className="buttons">
          <PosButton text="Add Child"
                     click={this.addChild} />
          <PosButton text="Add Rule"
                     click={this.addRule} />
          <NegButton text="Remove"
                     title="Remove Element"
                     click={this.remove} />
          {renameButton}
        </div>
      </div>
    );
  },
  componentWillMount: function() {
    unhighlight(currentSelector);
    if ( this.props.element ) {
      highlight(this.props.element.elements, currentSelector);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    unhighlight(currentSelector);
    if ( nextProps.element !== undefined && nextProps.element !== this.props.element ) {
      highlight(nextProps.element.elements, currentSelector);
    }
  },
  componentWillUnmount: function() {
    unhighlight(currentSelector);
  }
});

const RuleList = React.createClass({
  render: function() {
    const { rules, remove } = this.props;
    if ( !rules.length ) {
      return null;
    }
    return (
      <ul className="rules">
        {
          rules.map((r,i) => {
            return <Rule key={i} index={i} remove={remove} {...r}/>;
          })
        }
      </ul>
    );
  }
})

const Rule = React.createClass({
  handleClick: function(event) {
    event.preventDefault();
    this.props.remove(this.props.index);
  },
  render: function() {
    const { name, attr, type } = this.props;
    return (
      <li className="rule">
        <span className="rule-name" title="name">{name}</span>
        <span className="rule-attr" title="attribute (or text)">{attr}</span>
        <span className="rule-type" title="data type">{type}</span>
        <NegButton text={String.fromCharCode(215)}
                   classes={["transparent"]}
                   click={this.handleClick} />
      </li>
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
      element: element
    }
  },
  {
    showElementWizard,
    removeElement,
    renameElement,
    showRuleWizard,
    removeRule,
    toggleOptional
  }
)(ElementFrame);
