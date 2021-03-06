import React from 'react';
import PropTypes from 'prop-types';

export const PosButton = ({ classes, ...rest }) => (
  <NeutralButton {...rest} classes={['pos'].concat(classes)} />
);

export const NegButton = ({ classes, ...rest }) => (
  <NeutralButton {...rest} classes={['neg'].concat(classes)} />
);

const defaultClick = () => {};

export const NeutralButton = (props) => {
  const {
    children = '',
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
      onClick={click}
    >
      {children}
    </button>
  );
};

NeutralButton.propTypes = {
  children: PropTypes.any,
  click: PropTypes.func,
  classes: PropTypes.array,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string
};

PosButton.propTypes = NeutralButton.propTypes;
NegButton.propTypes = NeutralButton.propTypes;
