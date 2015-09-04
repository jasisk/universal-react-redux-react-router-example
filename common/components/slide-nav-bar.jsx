import React from 'react';

export default class SlideNavBar extends React.Component {
  render() {
    const { idx, onDecrement, onIncrement } = this.props;
    return (
      <div>
        <p>Slide Index: {idx}</p>
        <ul>
          <li><button onClick={onIncrement}>+</button></li>
          <li><button onClick={onDecrement}>—</button></li>
        </ul>
      </div>
    );
  }
}

SlideNavBar.propTypes = {
  idx: React.PropTypes.number.isRequired,
  onIncrement: React.PropTypes.func.isRequired,
  onDecrement: React.PropTypes.func.isRequired
};
