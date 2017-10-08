import React from 'react';
import PropTypes from 'prop-types';

import { shortElement } from 'helpers/text';
// import { highlight, unhighlight } from 'helpers/markup';
//import { savedPreview } from 'constants/CSSClasses';

class Node extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleMouseover = this.handleMouseover.bind(this);
    this.handleMouseout = this.handleMouseout.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.props.select(this.props.data.index);
  }

  handleMouseover() {
    // highlight(this.props.data.matches, savedPreview);
  }

  handleMouseout() {
    // unhighlight(savedPreview);
  }

  render() {
    const {
      current,
      data,
      active,
      children,
      x,
      y
    } = this.props;
    const {
      hasRules,
      selector,
      spec,
      optional
    } = data;
    const empty = !hasRules && !(children && children.length);

    // nodes with rules drawn as rect, nodes with no rules drawn as circles
    const marker = hasRules
      ? <rect width='6' height='6' x='-3' y='-3'></rect>
      : <circle r='3'></circle>;

    const classNames = [
      'node',
      current ? 'current' : null,
      empty ? 'empty' : null
    ];
    // only apply events when the node is 'active'
    const events = active ? {
      onClick: this.handleClick,
      onMouseOver: this.handleMouseover,
      onMouseOut: this.handleMouseout
    } : {};
    return (
      <g
        className={classNames.join(' ')}
        transform={`translate(${y},${x})`}
        {...events}
      >
        <text y='-10'>
          {shortElement(selector, spec, optional)}
        </text>
        {marker}
      </g>
    );
  }

  componentWillUnmount() {
    // unhighlight(savedPreview);
  }
}

Node.propTypes = {
  select: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  current: PropTypes.bool,
  active: PropTypes.bool,
  children: PropTypes.array,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};

export default Node;
