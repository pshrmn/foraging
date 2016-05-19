import React from 'react';

export function PosButton(props) {
  const { classes, ...rest } = props;
  return (
    <NeutralButton
      {...rest}
      classes={['pos'].concat(classes)} />
  );
}

export function NegButton(props) {
  const { classes, ...rest } = props;
  return (
    <NeutralButton
      {...rest}
      classes={['neg'].concat(classes)} />
  );
}

export function NeutralButton(props) {
  const {
    text = '',
    click = () => {},
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
