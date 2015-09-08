import { changeSlide } from '../actions/creators';
import { connect } from 'react-redux';
import React from 'react';

@connect(null, { changeSlide })
export default class Controller extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    let { changeSlide } = this.props;
    if (window) {
      window.changeSlide = changeSlide;
    }
    if (window.parent && window.parent.onInit) {
      window.parent.onInit();
    }
  }

  render() {
    let { children }  = this.props;
    return children;
  }
}
