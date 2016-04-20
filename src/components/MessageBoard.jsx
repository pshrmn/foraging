import React from "react";
import { connect } from "react-redux";

function MessageBoard(props) {
  const messages = props.messages.map(
    m => <Message key={m.id} message={m.message} rating={m.rating} />
  );
  return (
    <div className="message-board">
      { messages }
    </div>
  );
}

function Message(props) {
  const { message, rating } = props;
  const classes = [
    "message"
  ];
  if ( rating < 0 ) {
    classes.push("neg");
  } else if ( rating > 0 ) {
    classes.push("pos");
  }
  return (
    <div className={classes.join(" ")}>
      { message }
    </div>
  );
}

export default connect(
  state => ({
    messages: state.messages
  })
)(MessageBoard);
