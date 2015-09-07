import App from '../components/app';
import Connections from './connections';
export default {
  path: '/',
  component: App,
  childRoutes: [ Connections ]
};
