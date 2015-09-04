import React from 'react';

export default class Sentiment extends React.Component {
  render() {
    let {count, is, text, onClick} = this.props;
    return (
      <li>
        <button onClick={onClick}>
          {is ? `Remove ${text}` : `${text}`}
        </button>
        <span>{count}</span>
      </li>
    );
  }
}

Sentiment.defaultProps = {
  count: 0
};

Sentiment.propTypes = {
  is: React.PropTypes.bool.isRequired,
  text: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired
};
