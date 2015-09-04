import { KEY } from '../lib/connection-group';

export default () => function addGroup(req, res, next) {
  let group = req.app.kraken.get(KEY);
  let session = group.getSession(req.sessionID);

  req.broadcast = group.send.bind(group);
  req.sessionBroadcast = session ?
    session.send.bind(session) :
    function () {};

  next();
};
