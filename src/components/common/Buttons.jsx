import React from 'react';

export function PosButton(props) {
  const { classes, ...rest } = props;
  return (
    <NeutralButton {...rest}
                   classes={["pos"].concat(classes)} />
  );
}

export function NegButton(props) {
  const { classes, ...rest } = props;
  return (
    <NeutralButton {...rest}
                   classes={["neg"].concat(classes)} />
  );
}

export function NeutralButton(props) {
  const {
    text = "",
    click = () => {},
    classes = [],
    title = "",
    disabled = false
  } = props;
  return (
    <button className={classes.join(" ")}
            title={title}
            disabled={disabled}
            onClick={click} >
      {text}
    </button>
  );  
}
