import * as Actions from '../actions/creators';
import SentimentsBar from './sentiments-bar';
import SlideNavBar from './slide-nav-bar';
import { connect } from 'react-redux';
import Controller from './controller';
import { Link } from 'react-router';
import Websocket from './websocket';
import React from 'react';

const style = {
  fontFamily: "Helvetica, arial, nimbussansl, liberationsans, freesans, clean, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol'",
};

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
    return (
      <Controller>
        <Websocket>
          <MainBar {...this.props}></MainBar>
        </Websocket>
      </Controller>
    );
  }
}

export class MainBar extends React.Component {
  render () {
    const { children } = this.props;
    const { wsState, connections } = this.props;
    const { slideIdx: idx, decrementSlide: onDecrement, incrementSlide: onIncrement } = this.props;
    const { slide, counts, sentiments, addSentiment, removeSentiment } = this.props;
    const className = `state-${wsState}`;
    return (
      <div className={className} style={style}>
        <SlideNavBar {...{idx, onDecrement, onIncrement}}/>
        {children && React.cloneElement(children, { connections })}
        <SentimentsBar {...slide} {...{counts, sentiments, addSentiment, removeSentiment}} />
      </div>

    );
  }
}
