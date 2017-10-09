import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { curious } from '@curi/react';

import Wizard from 'simple-wizard-component';
import {
  Elements,
  Parts,
  CreateType as Type,
  CreateValue as Value,
  CreateOptional as Optional,
  ConfirmElement
} from 'components/steps/element';

import { saveElement } from 'actions';
import { highlight, unhighlight} from 'helpers/markup';
import { currentElement } from 'helpers/store';
import { currentSelector } from 'constants/CSSClasses';

const steps = [
  Elements,
  Parts,
  Type,
  Value,
  Optional,
  ConfirmElement
];

/*
 * Elements -> Parts -> Type -> Value -> Optional -> ConfirmElement
 * each step should make sure to pass the current object (the currently
 * selected element selector) as a property of the object returned
 * in its next call
 */
class ElementWizard extends React.Component {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  save(ele) {
    const { curi, response, saveElement } = this.props;

    saveElement(ele);
    const { name } = response.params;
    const pathname = curi.addons.pathname('Page', { name });
    curi.history.push(pathname);
  }

  cancel() {
    const { curi, response } = this.props;
    const { name } = response.params;
    const pathname = curi.addons.pathname('Page', { name });
    curi.history.push(pathname);
  }

  render() {
    const { current } = this.props;

    return (
      <Wizard
        steps={steps}
        initialData={{}}
        staticData={{
          parent: current
        }}
        save={this.save}
        cancel={this.cancel}
      />
    );
  }

  componentDidMount() {
    const { current } = this.props;
    highlight(current.matches, currentSelector);
  }

  componentDidUpdate() {
    unhighlight(currentSelector);
    const { current } = this.props;
    highlight(current.matches, currentSelector);
  }

  componentWillUnmount() {
    unhighlight(currentSelector);
  }
}

ElementWizard.propTypes = {
  /* curious */
  curi: PropTypes.object,
  response: PropTypes.object,
  /* connect */
  current: PropTypes.object,
  saveElement: PropTypes.func.isRequired,
};

export default curious(connect(
  state => {
    const { page } = state;
    return {
      current: currentElement(page)
    };
  },
  {
    saveElement
  }
)(ElementWizard));
