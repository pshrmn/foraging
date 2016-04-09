import React from 'react';

/*
 * Forager app specific input/form elements
 */

export const PosButton = React.createClass({
  render: function() {
    const { classes, ...rest } = this.props;
    return (
      <NeutralButton {...rest}
                     classes={["pos"].concat(classes)} />
    );
  }
});

export const NegButton = React.createClass({
  render: function() {
    const { classes, ...rest } = this.props;
    return (
      <NeutralButton {...rest}
                     classes={["neg"].concat(classes)} />
    );
  }
});

export const NeutralButton = React.createClass({
  getDefaultProps: function() {
    return {
      text: "",
      click: () => {},
      title: "",
      classes: []
    };
  },
  render: function() {
    const { text, click, classes, title } = this.props;
    return (
      <button className={classes.join(" ")}
              title={title}
              onClick={click} >
        {text}
      </button>
    );
  }
});
