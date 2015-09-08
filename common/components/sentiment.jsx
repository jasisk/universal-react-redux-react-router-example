import React from 'react';

const styles = {
  li: {
    display: 'inline-block'
  },
  a: {
    selected: {
      backgroundColor: '#49BF49',
      color: 'white',
    },
    default: {
      color: '#053385',
      display: 'block',
      backgroundColor: '#A5B4C7',
      marginRight: '5px',
      padding: '5px',
      borderRadius: '4px',
      textDecoration: 'none',
      overflow: 'hidden'
  }
  },
  emoji: {
    borderRadius: '4px',
    textIndent: '-999999em',
    float: 'left',
    height: '24px',
    marginRight: '5px',
    width: '24px'
  },
  span: {
    float: 'left',
    lineHeight: '24px',
    height: '24px'
  }
};

export default class Sentiment extends React.Component {
  render() {
    let {count, id, is, text, onClick} = this.props;
    return (
      <li style={styles.li} id={id}>
        <a href='#' className={`emojiLink${is ? ' active' : ''}`} onClick={onClick} style={is ? {...styles.a.default, ...styles.a.selected} : styles.a.default}>
          <span className={`emoji e${id}`} style={styles.emoji}>{text}</span>
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
