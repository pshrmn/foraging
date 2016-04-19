import React from "react";
import { connect } from "react-redux";

function MessageBoard(props) {
  const messages = props.messages.map(m => <Message key={m.id} text={m.text} />)
  return (
    <div className="message-board">
      { messages }
    </div>
  );
}

function Message(props) {
  return (
    <div className="message">
      { props.text }
    </div>
  );
}

export default connect(
  state => ({
    messages: state.messages
  })
)(MessageBoard);
