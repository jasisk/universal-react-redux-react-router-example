import React from 'react';

const style = {
  display: 'inline-block',
  padding: '9px 5px',
  margin: 0,
  fontSize: '16px',
  lineHeight: '16px',
  borderRadius: '4px',
  verticalAlign: 'top',
  opacity: 0.7
};

export default class ConnectionsBar extends React.Component {

  render () {
    const { connections } = this.props;
    return (
      <p style={style} className='connections'>Connections: { connections }</p>
    );
  }
}

ConnectionsBar.PropTypes = {
  connections: React.PropTypes.number
};
