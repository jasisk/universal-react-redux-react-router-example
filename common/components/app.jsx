import * as Actions from '../actions/creators';
import SentimentsBar from './sentiments-bar';
import SlideNavBar from './slide-nav-bar';
import { connect } from 'react-redux';
import Controller from './controller';
import { Link } from 'react-router';
import Websocket from './websocket';
import React from 'react';

@connect(
  state => {
    let {
      connections,
      slideIdx,
      entities: { counts, slides, sentiments }
    } = state;

    let slide = slides[slideIdx];
    counts = counts[slideIdx];

    return { connections, slideIdx, slide, counts, sentiments };
  }, Actions
)
export default class App extends React.Component {
  render() {

    const {
      incrementSlide: onIncrement,
      decrementSlide: onDecrement,
      removeSentiment,
      slideIdx: idx,
      addSentiment,
      connections,
      sentiments,
      children,
      counts,
      slide
    } = this.props;

    return (
      <Controller>
        <Websocket>
          <div>
            <p>Connections {connections}</p>
            <SlideNavBar {...{idx, onDecrement, onIncrement}}/>
            <SentimentsBar {...slide} {...{counts, sentiments, addSentiment, removeSentiment}} />
            <Link to='/party'>PARTY</Link>
            {children}
          </div>
        </Websocket>
      </Controller>
    );
  }
}
