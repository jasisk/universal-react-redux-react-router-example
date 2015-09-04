import { MemoryStore } from 'express-session';

export default function onconfigThunk(sessionMiddlewareKey) {
  const cookieKey = 'connect.sid';
  const store = new MemoryStore;

  return opts => {
    let onconfig = opts.onconfig;
    return {...opts, onconfig: (config, next) => {
      config.set(sessionMiddlewareKey, [{
        store,
        name: cookieKey,
        ...config.get(sessionMiddlewareKey)[0]
      }]);
      if (onconfig) {
        onconfig(config, next);
      } else {
        next(null, config);
      }
    }};
  };
}
