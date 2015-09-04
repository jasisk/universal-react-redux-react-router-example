import Sentiment from './sentiment';
import React from 'react';

export default class SentimentsBar extends React.Component {
  constructor(props, context) {
    super(props, context);
    // this.toggleSentiment = this.toggleSentiment.bind(this);
  }

  toggleSentimentThunk(sentiment) {
    const { sentiments, is, addSentiment, removeSentiment } = this.props;
    return (e) => includes(is, sentiment) ? removeSentiment(sentiment) : addSentiment(sentiment);
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

    return <ul>{Sentiments}</ul>;
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
