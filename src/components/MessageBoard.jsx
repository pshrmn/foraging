import React from 'react';
import { connect } from 'react-redux';

const MessageBoard = ({ messages }) => (
  <div className='message-board'>
    {
      messages.map(m =>
        <Message key={m.id} message={m.message} rating={m.rating} />
      )
    }
  </div>
);

MessageBoard.propTypes = {
  messages: React.PropTypes.array.isRequired
};

function Message(props) {
  const { message, rating } = props;
  const classes = [
    'message'
  ];
  if ( rating < 0 ) {
    classes.push('neg');
  } else if ( rating > 0 ) {
    classes.push('pos');
  }
  return (
    <div className={classes.join(' ')}>
      { message }
    </div>
  );
}

Message.propTypes = {
  message: React.PropTypes.string,
  rating: React.PropTypes.number
};

export default connect(
  state => ({
    messages: state.messages
  })
)(MessageBoard);
