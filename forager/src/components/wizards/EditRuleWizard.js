import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Wizard from 'simple-wizard-component';
import {
  Attribute,
  Type,
  Name,
  ConfirmUpdateRule
} from 'components/steps/rule';
import Cycle from 'components/common/Cycle';

import { updatePage } from 'actions';
import { highlight, unhighlight} from 'helpers/markup';
import { currentSelector } from 'constants/CSSClasses';

const steps = [
  Attribute,
  Type,
  Name,
  ConfirmUpdateRule
];

/*
 * Attribute -> Type -> Name -> ConfirmUpdateRule
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
    const { page, element, ruleIndex, updatePage, curi } = this.props;
    const newElement = {
      ...element,
      rules: element.rules.map((r,i) => i === ruleIndex ? rule : r)
    };
    const newPage = {
      ...page,
      elements: page.elements.map((e,i) => i === newElement.index ? newElement : e)
    };
    updatePage(newPage);

    const pathname = curi.addons.pathname('Page', { name: page.name });
    curi.history.push({
      pathname,
      query: { element: element.index }
    });
  }

  cancel() {
    const { curi, page } = this.props;
    const pathname = curi.addons.pathname('Page', { name: page.name });
    curi.history.push(pathname);
  }

  render() {
    const { page, element, rule } = this.props;
    const { index } = this.state;
    const { name, attr, type } = rule;

    return (
      <Wizard
        steps={steps}
        initialData={{
          element,
          index: 0,
          name,
          attr,
          type
        }}
        staticData={{
          page,
          element,
          current: element.matches[index]
        }}
        save={this.save}
        cancel={this.cancel}
      >
        <Cycle
          index={index}
          count={element.matches.length}
          setIndex={this.setIndex}
        />
      </Wizard>
    );
  }

  componentDidMount() {
    const { element } = this.props;
    highlight(element.matches, currentSelector);
  }

  componentDidUpdate() {
    unhighlight(currentSelector);
    const { element } = this.props;
    highlight(element.matches, currentSelector);
  }

  componentWillUnmount() {
    unhighlight(currentSelector);
  }
}

EditRuleWizard.propTypes = {
  element: PropTypes.object,
  ruleIndex: PropTypes.number,
  page: PropTypes.object,
  rule: PropTypes.object,
  /* connect */
  updatePage: PropTypes.func.isRequired,
  curi: PropTypes.object
};

export default connect(
  state => ({ curi: state.curi }),
  {
    updatePage
  }
)(EditRuleWizard);
