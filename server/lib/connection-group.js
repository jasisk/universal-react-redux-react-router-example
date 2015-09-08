import { unsign } from 'cookie-signature';
import pathToRegexp from 'path-to-regexp';
import { EventEmitter } from 'events';
import { parse } from 'cookie';

const routeRegex = pathToRegexp('/presentation/:pid/(.*)?', [], {end: true});


export function onConnection({stores, groups}) {
  return ws => {
    let group;
    const parts = routeRegex.exec(ws.upgradeReq.url);
    const pid = parts && parts[1];
    if (pid in stores) {
      if (!(group = groups.get(pid))) {
        group = groups.create(pid);

        function connectionCount() {
          let size = group.size;
          stores[pid].store.connections = size;
          group.send({
            type: 'CONNECTION_COUNT_CHANGED',
            count: size
          });
        }

        group.on('add', () => group.once('change', connectionCount));
        group.on('delete', connectionCount);
        group.on('delete', () => {group.size || groups.delete(pid)});
      }
      group.newConnection(ws);
    } else {
      ws.close(1001);
    }
  };
}

export default class ConnectionGroup extends EventEmitter {
  constructor({store, name, secret}) {
    super();
    this.sessions = new Map;
    this.store = store;
    this.name = name;
    this.secret = secret;
    this.onConnection = this.onConnection.bind(this);
  }

  get size() {
    return this.sessions.size;
  }

  onConnection(callback) {
    return (ws) => this.newConnection(ws, callback);
  }
  newConnection(ws, callback) {
    let session;
    let { [this.name]: sid } = parse(ws.upgradeReq.headers.cookie);
    sid = sid.substr(0, 2) === 's:' ? unsign(sid.slice(2), this.secret) : sid;
    session = this.getSession(sid) || this.addSession(sid);
    let connection = new Connection({ws, sid});
    session.add(connection);
    callback && callback({session, connection});
  }

  getStore(sid, cb) {
    this.store.get(sid, cb);
  }

  deleteSession(sid) {
    if (this.sessions.delete(sid)) {
      this.emit('delete', sid);
    }
  }

  addSession(sid) {
    let session = new Session(sid);
    session.on('empty', () => this.deleteSession(sid));
    ['add', 'delete'].forEach(predicate => {
      session.on(predicate, connection => this.emit('change', sid, session.size));
    });
    this.sessions.set(sid, session);
    this.emit('add', sid);
    return session;
  }

  getSession(sid) {
    return this.sessions.get(sid);
  }

  send(obj) {
    for (let [sid, session] of this.sessions) {
      session.send(obj);
    }
  }
}

export const KEY = '@@CONNECTIONGROUP';
export function defaultLogger(group) {
  group.on('add', sid =>
    console.log(`New sid (${sid}) (total: ${group.size}) ...`)
  );
  group.on('delete', sid =>
    console.log(`Terminated (${sid}) (total: ${group.size}) ...`)
  );
  group.on('change', (sid, size) =>
    size && console.log(`Session size changed (${sid}): ${size} ...`)
  );
};

class Session extends EventEmitter {
  constructor(sid) {
    super();
    this.sid = sid;
    this.connections = new Set;
  }

  get size() {
    return this.connections.size;
  }

  add(connection) {
    if (connection.ws.readyState < connection.ws.CLOSING) {
      this.connections.add(connection);
      this.emit('add', connection);
      connection.ws.once('close', code => this.delete(connection));
    } else {
      if (!(this.connections.size)) {
        this.emit('empty');
      }
    }
  }

  delete(connection) {
    this.connections.delete(connection);
    this.emit('delete', connection);
    if (!(this.connections.size)) {
      this.emit('empty');
    }
  }

  send(obj) {
    for (let connection of this.connections) {
      connection.send(obj);
    }
  }
}

class Connection {
  constructor({ws, sid}) {
    this.sid = sid;
    this.ws = ws;
  }

  close(code) {
    this.ws.close(code);
  }

  send(obj) {
    this.ws.send(JSON.stringify(obj));
  }
}
