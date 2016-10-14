import React from 'react';

export const PosButton = ({ classes, ...rest }) => (
  <NeutralButton
    {...rest}
    classes={['pos'].concat(classes)} />
);

export const NegButton = ({ classes, ...rest }) => (
  <NeutralButton
    {...rest}
    classes={['neg'].concat(classes)} />
);

const defaultClick = () => {};

export const NeutralButton = (props) => {
  const {
    text = '',
    click = defaultClick,
    classes = [],
    title = '',
    disabled = false,
    type = 'button'
  } = props;

  return (
    <button
      className={classes.join(' ')}
      title={title}
      disabled={disabled}
      type={type}
      onClick={click} >
      {text}
    </button>
  );
};

NeutralButton.propTypes = {
  text: React.PropTypes.string,
  click: React.PropTypes.func,
  classes: React.PropTypes.array,
  title: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  type: React.PropTypes.string
};

PosButton.propTypes = NeutralButton.propTypes;
NegButton.propTypes = NeutralButton.propTypes;
