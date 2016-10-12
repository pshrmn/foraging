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
import { currentElement } from 'helpers/store';
import { currentSelector } from 'constants/CSSClasses';

const steps = [
  ChooseAttribute,
  ChooseType,
  ChooseName,
  ConfirmUpdateRule
];

/*
 * ChooseAttribute -> ChooseType -> ChooseName -> ConfirmRule
 */
class EditRuleWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };
    this.setIndex = this.setIndex.bind(this);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  setIndex(index) {
    this.setState({
      index
    });
  }

  save(rule) {
    const { updateRule, ruleIndex } = this.props;
    updateRule(ruleIndex, rule);
  }

  cancel() {
    this.props.cancel();
  }

  render() {
    const { current, ruleIndex } = this.props;
    // make sure that the rule exists
    const rule = current.rules[ruleIndex];
    if ( ruleIndex === undefined || ruleIndex === undefined) {
      return null;
    }
    const { index } = this.state;
    const { name, attr, type } = rule;

    return (
      <div className='frame'>
        <ElementCard active={false} element={current} />
        <Wizard
          steps={steps}
          initialData={{
            current,
            index: 0,
            name,
            attr,
            type
          }}
          staticData={{
            element: current.matches[index]
          }}
          save={this.save}
          cancel={this.cancel}>
          <Cycle
            index={index}
            count={current.matches.length}
            setIndex={this.setIndex} />
        </Wizard>
      </div>
    );
  }

  componentWillMount() {
    const { current } = this.props;
    highlight(current.matches, currentSelector);
  }

  componentWillUpdate(nextProps, nextState) {
    unhighlight(currentSelector);
    const { current } = this.props;
    highlight(current.matches, currentSelector);
  }

  componentWillUnmount() {
    unhighlight(currentSelector);
  }
}

export default connect(
  state => {
    const { page, frame } = state;
    return {
      current: currentElement(page),
      ruleIndex: frame.index
    };
  },
  {
    updateRule,
    cancel: showElementFrame
  }
)(EditRuleWizard);
