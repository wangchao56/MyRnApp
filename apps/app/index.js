import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

console.log('App loaded at:', new Date().toISOString());

AppRegistry.registerComponent(appName, () => App);
