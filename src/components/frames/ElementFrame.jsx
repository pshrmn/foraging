import React from "react";
import { connect } from "react-redux";

import { showElementWizard, removeElement, updateElement,
  showRuleWizard, removeRule, showEditRuleWizard } from "../../actions";
import { PosButton, NegButton, NeutralButton } from "../common/Buttons";
import { highlight, unhighlight } from "../../helpers/markup";
import { currentSelector } from "../../constants/CSSClasses";

const ElementFrame = React.createClass({
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
    const { element, updateElement } = this.props;
    updateElement(element.index, {
      spec: {
        type: "all",
        value: newName
      }
    });
  },
  removeRule: function(index) {
    this.props.removeRule(index);
  },
  updateRule: function(index) {
    this.props.showEditRuleWizard(index);
  },
  toggleOptional: function(event) {
    const { updateElement, element } = this.props;
    updateElement(element.index, {
      optional: !element.optional
    });
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
      description = `captures element at index ${value}`;
    } else if ( type === "all" ) {
      description = `captures all elements, groups them as "${value}"`;
      
    }
    const renameButton = type === "all" ? <NeutralButton text="Rename" click={this.rename} /> : null;
    return (
      <div className="frame">
        <div className="info">
          <div>
            <span className="big bold">{selector}</span>
          </div>
          <div>
            {description}
          </div>
          <div>
            <button onClick={this.toggleOptional}
                    title="click to toggle optional">
              Optional
              <input type="checkbox" checked={optional} onChange={() => {}} />
            </button>
          </div>
          <RuleList rules={rules}
                    remove={this.removeRule}
                    update={this.updateRule} />
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
      highlight(this.props.element.matches, currentSelector);
    }
  },
  componentWillReceiveProps: function(nextProps) {
    unhighlight(currentSelector);
    if ( nextProps.element !== undefined && nextProps.element !== this.props.element ) {
      highlight(nextProps.element.matches, currentSelector);
    }
  },
  componentWillUnmount: function() {
    unhighlight(currentSelector);
  }
});

const RuleList = React.createClass({
  render: function() {
    const { rules, remove, update } = this.props;
    if ( !rules.length ) {
      return null;
    }
    return (
      <ul className="rules">
        {
          rules.map((r,i) => {
            return <Rule key={i} index={i} remove={remove} update={update} {...r}/>;
          })
        }
      </ul>
    );
  }
})

const Rule = React.createClass({
  handleDelete: function(event) {
    event.preventDefault();
    this.props.remove(this.props.index);
  },
  handleUpdate: function(event) {
    event.preventDefault();
    this.props.update(this.props.index);
  },
  render: function() {
    const { name, attr, type } = this.props;
    return (
      <li className="rule">
        <span className="rule-name" title="name">{name}</span>
        <span className="rule-attr" title="attribute (or text)">{attr}</span>
        <span className="rule-type" title="data type">{type}</span>
        <NeutralButton text="Edit"
                       click={this.handleUpdate} />
        <NegButton text="Delete"
                   click={this.handleDelete} />
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
    updateElement,
    showRuleWizard,
    removeRule,
    showEditRuleWizard
  }
)(ElementFrame);
