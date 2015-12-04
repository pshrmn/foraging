import React from "react";

/*
 * Message
 * -------
 *
 * A message is a simple text string that is displayed to the user. An optional
 * fade prop can also be passed, which is used to hide the text string after
 * the fade time has passed.
 */
export default React.createClass({
  getInitialState: function() {
    return {
      text: "",
      faded: true
    }
  },
  componentWillMount: function() {
    this.setState({
      text: this.props.text,
      faded: false
    });
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      text: nextProps.text,
      faded: false
    });
  },
  render: function() {
    let { text } = this.state;
    return (
      <div className="message">
        {text}
      </div>
    );
  },
  componentDidMount: function() {
    this.fade();
  },
  componentDidUpdate: function() {
    this.fade();
  },
  fade: function() {
    clearTimeout(this.timeout);
    let wait = this.props.fade;
    if ( wait !== undefined && this.state.faded === false ) {
      this.timeout = setTimeout(() => {
        this.setState({
          text: "",
          faded: true
        });
      }, wait);
    }
  },
  timeout: undefined
});
