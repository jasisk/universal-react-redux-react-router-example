import React from 'react';

const styles = {
  li: {
    float: 'left'
  },
  a: {
    selected: {
      backgroundColor: 'green'
    },
    default: {
      display: 'block',
      backgroundColor: 'grey',
      marginRight: '5px',
      padding: '5px',
      borderRadius: '5px',
      textDecoration: 'none',
      overflow: 'hidden'
  }
  },
  emoji: {
    borderRadius: '5px',
    textIndent: '-999999em',
    float: 'left',
    height: '25px',
    marginRight: '5px',
    width: '25px',
    backgroundColor: 'black'
  },
  span: {
    float: 'left',
    lineHeight: '25px',
    height: '25px'
  }
};

export default class Sentiment extends React.Component {
  render() {
    let {count, is, text, onClick} = this.props;
    return (
      <li style={styles.li}>
        <a href='#' onClick={onClick} style={is ? {...styles.a.default, ...styles.a.selected} : styles.a.default}>
          <span style={styles.emoji}>{text}</span>
          <span style={styles.span}>{count}</span>
        </a>
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
