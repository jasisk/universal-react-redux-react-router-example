import { KEY } from '../lib/connection-group';

export default () => function addGroup(req, res, next) {
  const { kraken: config } = req.app;
  const groups = config.get(KEY);
  const group = groups.get(req.params.pid);
  const session = group.getSession(req.sessionID);

  req.broadcast = group.send.bind(group);
  req.sessionBroadcast = session ?
    session.send.bind(session) :
    function () {};

  next();
};
