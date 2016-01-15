import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as ForagerActions from "../actions";

import Controls from "../components/Controls";
import Frames from "../components/frames/Frames";
import PageTree from "../components/PageTree";
import Preview from "../components/Preview";
import NoSelectMixin from "../components/NoSelectMixin";

const Forager = React.createClass({
  mixins: [NoSelectMixin],
  render: function() {
    const { pages, pageIndex, element, show,
          dispatch, frame, preview, message } = this.props;
    const page = pages[pageIndex];
    const actions = bindActionCreators(ForagerActions, dispatch);
    const classNames = [];
    if ( !show ) {
      classNames.push("hidden");
    }
    const previewModal = preview.visible ? (
      <Preview page={page} close={actions.hidePreview} />
    ) : null;

    return (
      <div id="forager" className={classNames.join(" ")} ref="parent">
        <Controls pages={pages}
                  index={pageIndex}
                  message={message}
                  actions={actions} />
        <div className="workspace">
          <PageTree page={page}
                    element={element}
                    actions={actions}
                    active={frame.name === "element"}/>
          <Frames element={element}
                  frame={frame}
                  actions={actions} />
        </div>
        {previewModal}
      </div>
    );
  }
});


function mapStateToProps(state) {
  // while pages and pageIndex are stored under page in the store,
  // destructure them in the app
  return {
    show: state.show,
    frame: state.frame,
    pages: state.page.pages,
    pageIndex: state.page.pageIndex,
    element: state.element,
    preview: state.preview,
    message: state.message
  };
}

export default connect(
  mapStateToProps
)(Forager);
