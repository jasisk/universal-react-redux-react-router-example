import React from 'react';

export default class ConnectionsBar extends React.Component {
  render () {
    const { connections } = this.props;
    return (
      <p>Connections: { connections }</p>
    );
  }
}

ConnectionsBar.PropTypes = {
  connections: React.PropTypes.number
};
