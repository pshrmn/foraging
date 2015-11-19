/*
 * Forager app specific input/form elements
 */

export const PosButton = React.createClass({
  render: function() {
    let { text, click } = this.props;
    return (
      <button className="pos" onClick={click}>{text}</button>
    );
  }
});

export const NegButton = React.createClass({
  render: function() {
    let { text, click } = this.props;
    return (
      <button className="neg" onClick={click}>{text}</button>
    );
  }
});

export const NeutralButton = React.createClass({
  render: function() {
    let { text, click } = this.props;
    return (
      <button className="neutral" onClick={click}>{text}</button>
    );
  }
});
