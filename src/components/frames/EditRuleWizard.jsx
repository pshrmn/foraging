import React from 'react';
import { connect } from 'react-redux';

import Wizard from 'simple-wizard-component';
import ElementCard from 'components/ElementCard';
import {
  ChooseAttribute,
  ChooseType,
  ChooseName,
  ConfirmUpdateRule
} from 'components/steps/rule';
import Cycle from 'components/common/Cycle';

import { updateRule, showElementFrame } from 'actions';
import { highlight, unhighlight} from 'helpers/markup';
import { currentSelector } from 'constants/CSSClasses';

/*
 * ChooseAttribute -> ChooseType -> ChooseName -> ConfirmRule
 */
const EditRuleWizard = React.createClass({
  getInitialState: function() {
    return {
      index: 0
    };
  },
  setIndex: function(index) {
    this.setState({
      index
    });
  },
  save: function(rule) {
    const { updateRule, ruleIndex } = this.props;
    updateRule(ruleIndex, rule);
  },
  cancel: function() {
    this.props.cancel();
  },
  render: function() {
    const { current, ruleIndex } = this.props;
    // make sure that the rule exists
    const rule = current.rules[ruleIndex];
    if ( ruleIndex === undefined || ruleIndex === undefined) {
      return null;
    }

    const { index } = this.state;

    const { name, attr, type } = rule;
    const initialData = {
      current,
      index: 0,
      name,
      attr,
      type
    };
    const extraData = {
      element: current.matches[index]
    };
    const steps = [
      ChooseAttribute,
      ChooseType,
      ChooseName,
      ConfirmUpdateRule
    ];
    return (
      <div className='frame'>
        <ElementCard active={false} element={current} />
        <Wizard
          steps={steps}
          initialData={initialData}
          extraData={extraData}
          save={this.save}
          cancel={this.cancel}>
          <Cycle
            index={index}
            count={current.matches.length}
            setIndex={this.setIndex} />
        </Wizard>
      </div>
    );
  },
  componentWillMount: function() {
    const { current } = this.props;
    highlight(current.matches, currentSelector);
  },
  componentWillUpdate: function(nextProps, nextState) {
    unhighlight(currentSelector);
    const { current } = this.props;
    highlight(current.matches, currentSelector);
  },
  componentWillUnmount: function() {
    unhighlight(currentSelector);
  }
});

export default connect(
  state => {
    const { page, frame } = state;
    const { pages, pageIndex, elementIndex } = page;

    const currentPage = pages[pageIndex];
    const current = currentPage === undefined ? undefined : currentPage.elements[elementIndex];
    return {
      current,
      ruleIndex: frame.index
    };
  },
  {
    updateRule,
    cancel: showElementFrame
  }
)(EditRuleWizard);
