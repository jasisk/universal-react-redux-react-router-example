import App from '../components/app';
import Connections from './connections';
export default {
  path: '/presentation/:pid',
  component: App,
  childRoutes: [ Connections ]
};
