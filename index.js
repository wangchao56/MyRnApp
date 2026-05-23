/**
 * @format
 */

import {enableScreens} from 'react-native-screens';
import {AppRegistry} from 'react-native';

enableScreens();
import App from './packages/app/src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
