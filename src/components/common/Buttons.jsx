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
}
