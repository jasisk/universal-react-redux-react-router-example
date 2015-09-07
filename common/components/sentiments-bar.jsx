import Sentiment from './sentiment';
import React from 'react';


const style = {
  listStyleType: 'none',
  padding: 0,
  margin: 0,
  overflow: 'hidden'
};

export default class SentimentsBar extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  toggleSentimentThunk(sentiment) {
    const { sentiments, is, addSentiment, removeSentiment } = this.props;
    return (e) => {
      e.preventDefault();
      includes(is, sentiment) ? removeSentiment(sentiment) : addSentiment(sentiment)
    };
  }

  render() {
    const { sentiments, counts, is } = this.props;
    let Sentiments = Object.keys(sentiments).map(sentiment => {
      let { text, id } = sentiments[sentiment];
      return <Sentiment
        id={id}
        count={counts[sentiment]}
        is={includes(is, sentiment)}
        text={text}
        onClick={this.toggleSentimentThunk(sentiment)}
      />
    });

    return <ul style={style}>{Sentiments}</ul>;
  }
}

SentimentsBar.defaultProps = {
  is: [],
  sentiments: {
    liked: { id: 'liked', text: 'Like' },
    disliked: { id: 'disliked', text: 'Dislike' }
  }
};

SentimentsBar.propTypes = {
  addSentiment: React.PropTypes.func.isRequired,
  removeSentiment: React.PropTypes.func.isRequired,
  is: React.PropTypes.array.isRequired,
  sentiments: React.PropTypes.object
};

function includes(arr, obj) {
  return !!~arr.indexOf(obj);
}
