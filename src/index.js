import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
// import BackgroundTimer from 'react-native-background-timer';
// import Geolocation from 'react-native-geolocation-service';
// var PushNotification = require('react-native-push-notification');

import {Home} from './screens';

// Start a timer that runs continuous after X milliseconds
// const intervalId = BackgroundTimer.setInterval(() => {
//   // this will be executed every 200 ms
//   // even when app is the the background
//   console.log('tac');
// }, 200);
// BackgroundTimer.start(5000);
// const EventEmitter = Platform.select({
//   ios: () => NativeAppEventEmitter,
//   android: () => DeviceEventEmitter,
// })();
// EventEmitter.addListener('backgroundTimer', () => {
//   // this will be executed once after 5 seconds
//   console.log('tic-tak-toe');
// });
// PushNotification.configure({
//   onNotification: function (notification) {
//     console.log('NOTIFICATION:', notification);

//     // process the notification
//   },
//   popInitialNotification: false,
//   requestPermissions: true,
// });

// const backgroundJob = {
//   jobKey: 'myJob',
//   job: () => {
//     console.log('Hello There');
//     console.log('Running in background');
//     PushNotification.localNotification({
//       /* Android Only Properties */

//       smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
//       bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
//       subText: 'This is a subText', // (optional) default: none

//       vibrate: true, // (optional) default: true
//       vibration: 100, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
//       tag: 'some_tag', // (optional) add tag to message
//       group: 'group', // (optional) add group to message
//       ongoing: false, // (optional) set whether this is an "ongoing" notification
//       priority: 'high', // (optional) set notification priority, default: high
//       visibility: 'private', // (optional) set notification visibility, default: private
//       importance: 'high', // (optional) set notification importance, default: high
//       allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
//       ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)

//       /* iOS and Android properties */
//       title: 'My Notification Title', // (optional)
//       message: 'My Notification Message', // (required)
//       playSound: false, // (optional) default: true
//       soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
//       number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
//       repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
//       actions: '["Yes", "No"]', // (Android only) See the doc for notification actions to know more
//     });
//   },
// };

// BackgroundJob.register(backgroundJob);

// var backgroundSchedule = {
//   jobKey: 'myJob',
// };
// BackgroundJob.schedule(backgroundSchedule);
const App = createStackNavigator(
  {
    Home,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);
export default createAppContainer(App);
