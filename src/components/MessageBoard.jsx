import React from "react";
import { connect } from "react-redux";

function MessageBoard(props) {
  const messages = props.messages.map(m => <Message key={m.id} message={m.message} />)
  return (
    <div className="message-board">
      { messages }
    </div>
  );
}

function Message(props) {
  return (
    <div className="message">
      { props.message }
    </div>
  );
}

export default connect(
  state => ({
    messages: state.messages
  })
)(MessageBoard);
