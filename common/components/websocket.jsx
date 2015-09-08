import { connect } from 'react-redux';
import React from 'react';

@connect()
export default class Websocket extends React.Component{
  constructor(props, context) {
    super(props, context);
    this.state = {
      state: 3 // WebSocket.CLOSED
    };
  }

  componentDidMount() {
    let { dispatch } = this.props;
    let ws = new WebSocket(`ws://${location.host}${location.pathname}`);
    ws.onopen = () => this.setState({ state: WebSocket.OPEN });
    ws.onclose = () => this.setState({ state: WebSocket.CLOSED });
    ws.onmessage = (e) => dispatch(JSON.parse(e.data));
  }

  render() {
    let { children } = this.props;
    let { state: wsState } = this.state;
    let child = React.Children.only(children);
    return React.cloneElement(child, {wsState});
  }
}
