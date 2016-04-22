import React from "react";
import { connect } from "react-redux";

import Wizard from "simple-wizard-component";
import NoSelectMixin from "../NoSelectMixin";
import ChooseElements from "../steps/ChooseElements";
import ChooseParts from "../steps/ChooseParts";
import ChooseSpec from "../steps/ChooseSpec";

import { saveElement, showElementFrame } from "../../actions";

/*
 * ChooseElements -> ChooseParts -> ChooseSpec
 * each step should make sure to pass the current object (the currently
 * selected element selector) as a property of the object returned
 * in its next call (except ChooseSpec, which doesn't care)
 */
const ElementWizard = React.createClass({
  mixins: [NoSelectMixin],
  save: function(data) {
    this.props.saveElement(data);
  },
  cancel: function() {
    this.props.cancel();
  },
  render: function() {
    const { current } = this.props;
    const initialData = {
      current
    };
    return (
      <div ref="parent">
        <Wizard steps={[ChooseElements, ChooseParts, ChooseSpec]}
                initialData={initialData}
                save={this.save}
                cancel={this.cancel} />
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
      current: element
    };
  },
  {
    saveElement,
    cancel: showElementFrame
  }
)(ElementWizard);
