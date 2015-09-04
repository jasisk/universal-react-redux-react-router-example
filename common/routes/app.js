import App from '../components/app';
import Party from './party';
export default {
  path: '/',
  component: App,
  childRoutes: [ Party ]
};
