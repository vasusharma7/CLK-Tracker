/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import {ProgressChart} from 'react-native-chart-kit';
import React, {memo} from 'react';
// import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
// import {NavigationContainer} from '@react-navigation/native';
// import BackgroundJob from 'react-native-background-job';
// const Tab = createMaterialBottomTabNavigator();
// import BackgroundTask from 'react-native-background-task';
import BackgroundService from 'react-native-background-actions';
// import loader from '../assets/4.gif';
import loader from '../assets/loader.gif';
import lock from '../assets/lock.png';

var PushNotification = require('react-native-push-notification');
PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

    PushNotification.cancelAllLocalNotifications();
  },
  popInitialNotification: false,
  requestPermissions: true,
});
const veryIntensiveTask = async (taskDataArguments) => {
  // Example of an infinite loop task
  const {delay} = taskDataArguments;
  await new Promise(async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      // console.log(i);
      await new Promise((r) => setTimeout(r, 2000));
    }
  });
};
const options = {
  taskName: 'LocationTrack',
  taskTitle: 'COVID-19 Lockdown',
  taskDesc: 'Tracking if you stay indoors',
  icon: 'notify',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  parameters: {
    delay: 1000,
  },
};
// BackgroundTask.define(() => {
//   console.log('Hello from a background task');
// });
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  PermissionsAndroid,
  Alert,
  AsyncStorage,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';

//   console.log(`Callback: isIgnoring = ${isIgnoring}`),
// )
//   .then((isIgnoring) => console.log(`Promise: isIgnoring = ${isIgnoring}`))
//   .catch((err) => console.err(err));

import Geolocation from 'react-native-geolocation-service';
import {BottomNavigation, Appbar, Headline, FAB} from 'react-native-paper';

import {LocationView} from 'react-native-location-view';

const {width, height} = Dimensions.get('window');

import {India, HomeScreen, WorldScreen} from './';
import {parse} from 'react-native-svg';

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const BOUNDARY = 200;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

var I1,
  I2,
  I3 = 0;

console.log('INTERVAL', I3);

class Home extends React.Component {
  storeData = async (latitude, longitude) => {
    try {
      // console.log('latitiude', latitude);
      // console.log('longitude', longitude);
      await AsyncStorage.setItem('latitude', latitude.toString());
      await AsyncStorage.setItem('longitude', longitude.toString());
      this.setHome();
      this.getData();
      var disabled = 0;

      if (!BackgroundService.isRunning()) {
        //to be still tested
        // BackgroundTask.schedule({
        //   period: 900,
        // });
        this.startJob();
      }
      console.log('mounted');
    } catch (e) {
      console.log('store', e);
    }
  };
  getData = async () => {
    try {
      await AsyncStorage.getItem('latitude').then((res) => {
        this.setState({homeLat: res});
      });
      await AsyncStorage.getItem('longitude').then((res) => {
        this.setState({homeLng: res});
      });
      if (this.state.homeLat !== null && this.state.homeLng !== null) {
        console.log('inside home');
        this.setState({home: true});
        this.setState({loading: false});
        // I1 = setInterval(this.getLocation, 5000);
        // I2 = setInterval(this.validate, 5000);

        // if (!BackgroundService.isRunning()) {
        //   // BackgroundTask.schedule({
        //   //   period: 900,
        //   // });
        //   this.startJob();
        // }
      } else {
        console.log('hello there', this.state.homeLat);
      }
    } catch (e) {
      console.log('getData', e);
    }
  };
  toggle = async () => {
    await AsyncStorage.getItem('disable').then(async (res) => {
      if (res === 'true') {
        await AsyncStorage.setItem('disable', 'false');
        this.setState({disabled: false});
        this.startJob();
        Alert.alert('Location Tracking Enabled', 'Stay Home,Stay Safe');
      } else {
        this.setState({disabled: true});
        await AsyncStorage.setItem('disable', 'true');
        await BackgroundService.stop();
        Alert.alert('Location Tracking Disabled', 'Stay Home, Stay Safe');
      }
    });
  };
  constructor() {
    super();
    this.state = {
      loading: true,
      disabled: false,
      granted: false,
      visible: true,
      dkey: 0,
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      lkey: 0,
      hkey: 0,
      home: null,
      homeLat: null,
      homeLng: null,
      lat: null,
      lng: null,
      rkey: 0,
      timer: 0,
      data: {
        index: 0,

        routes: [
          {
            key: 'settings',
            title: 'Tracker',
            icon: 'settings',
            color: '#111',
          },
          {
            key: 'summary',
            title: 'Summary',
            icon: 'history',
            color: '#000',
          },
          {
            key: 'india',
            title: 'India',
            icon: 'home',
            color: '#08130D',
          },
          {key: 'world', title: 'World', icon: 'earth', color: '#333'},
        ],
      },
    };
  }
  veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const {delay} = taskDataArguments;
    await new Promise(async (resolve) => {
      for (let i = 0; BackgroundService.isRunning(); i++) {
        console.log('Still Running');
        await new Promise((r) => setTimeout(r, 10000));
      }
    });
  };

  startJob = async () => {
    console.log('Job Started');
    await BackgroundService.start(veryIntensiveTask, options);
    await AsyncStorage.setItem('attack', 'false');
  };

  chartConfig = {
    backgroundGradientFrom: 'black',
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: 'black',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.9,
    paddingRight: 10,
  };
  Stats = () => (
    <>
      <Appbar.Header
        dark
        statusBarHeight={5}
        style={{backgroundColor: '#111', textAlign: 'center'}}>
        <Appbar.Content title="Track Yourself" subtitle="Obey Lockdown" />
      </Appbar.Header>

      <View
        style={{
          backgroundColor: 'rgba(0,0,0,1)',
          height: height,
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          padding: 0,
        }}
        key={this.state.rkey}>
        <Headline style={{textAlign: 'center', color: 'white'}}>
          Lockdown Distance Meter
        </Headline>
        <Text style={{textAlign: 'center', color: 'white'}}>
          Stay Home, Stay Safe !
        </Text>

        <ProgressChart
          key={this.state.rkey}
          data={{
            lables: ['Distance'],
            data:
              [this.state.dkey / BOUNDARY] > 1
                ? [1]
                : [this.state.dkey / BOUNDARY],
          }}
          width={width}
          height={250}
          strokeWidth={8}
          radius={100}
          chartConfig={this.chartConfig}
          hideLegend={false}
        />

        <Text style={{color: 'white', fontSize: 20}}>
          Distance from home ~ {parseFloat(this.state.dkey).toFixed(4)} m
        </Text>

        {parseFloat(this.state.dkey) > BOUNDARY ? (
          <Text style={{color: 'white'}}>
            {'\n'}You have broken LockDown ! Please Stay Indoors.
          </Text>
        ) : (
          <Text style={{color: 'white'}}>
            {'\n'}You are within safe distance from your house.
          </Text>
        )}
        {this.state.disabled ? (
          <FAB style={styles.fab} large icon="play" onPress={this.toggle} />
        ) : (
          <FAB style={styles.fab} large icon="stop" onPress={this.toggle} />
        )}
      </View>
    </>
  );
  _handleIndexChange = (index) =>
    this.setState({data: {index: index, routes: this.state.data.routes}});

  _renderScene = BottomNavigation.SceneMap({
    world: WorldScreen,
    summary: HomeScreen,
    india: India,
    settings: this.Stats,
  });

  getLocation = async (initial = false) => {
    if (!this.state.granted) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission Required',
          message: 'Grant  Access to use the App',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED)
        this.setState({granted: true});
      else {
        Alert.alert('Ah Snap !', 'Cannot Continue without location');
        this.setState({granted: false});
        this.setState({home: false});
        this.setState({loading: true});
        return;
      }
    }
    this.setState({granted: true});

    Geolocation.getCurrentPosition(
      (position) => {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        // console.log(lat, lng);
        var region = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

        // Alert.alert(
        //   initialRegion.latitude.toString(),
        //   initialRegion.longitude.toString(),
        // );

        if (initial === true) {
          this.setState({home: false});
          this.setState({loading: false});
          console.log('initial', region);
          this.setState({initialPosition: region});
          this.setState({lkey: this.state.lkey === 0 ? 1 : 0});
        } else {
          this.setState({lat: lat.toString(), lng: lng.toString()});
        }
        // console.log(this.state.initialPosition);
      },
      (error) => {
        // See error code charts below.
        console.log('Error In Fetching Location', error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        forceRequestLocation: true,
        distanceFilter: 100,
      },
    );
  };
  convertio(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }
  check = async () => {
    var snooze;
    await AsyncStorage.getItem('snooze').then((res) => {
      snooze = res;
    });
    console.log('inside - snooze', snooze);
    if (snooze === 'true') {
      await AsyncStorage.setItem('snooze', 'false');
    }
  };
  validate = async () => {
    var lat1 = this.convertio(parseFloat(this.state.homeLat).toFixed(7));
    var lon1 = this.convertio(parseFloat(this.state.homeLng).toFixed(7));

    var lat2 = this.convertio(parseFloat(this.state.lat));
    var lon2 = this.convertio(parseFloat(this.state.lng));
    var R = 6371e3; // metres

    var φ1 = lat1;
    var φ2 = lat2;
    var Δφ = Math.abs(lat2 - lat1);
    var Δλ = Math.abs(lon2 - lon1);
    // console.log('1', φ1, '2', φ2, '3', Δφ, '4', Δλ);
    var a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    // console.log('a', a , 'c', c);
    console.log('distance', d, ' ', this.state.dkey);
    if (!isNaN(this.state.dkey) && this.state.dkey !== 0) {
      if (Math.abs(d - this.state.dkey) > 50) {
        this.setState({dkey: isNaN(d) ? this.state.dkey : d});
      } else {
        //
      }
    } else {
      this.setState({dkey: isNaN(d) ? this.state.dkey : d});
    }
    if (this.state.data.index === 0) {
      this.setState({rkey: this.state.rkey === 0 ? 1 : 0});
    }
    if (d > BOUNDARY / 2) {
      this.chartConfig = {
        ...this.chartConfig,
        color: (opacity = 1) => `rgba(146, 10, 26, ${opacity})`,
      };
    }
    var disable = 0;
    await AsyncStorage.getItem('disable').then((res) => {
      if (res === 'true') {
        console.log('DISABLED');
        disable = 1;
      } else {
        console.log('RESPONSE', res);
      }
    });
    if (disable === 1) {
      console.log('RETURNING');
      return;
    }
    var snooze;
    await AsyncStorage.getItem('snooze').then((res) => {
      snooze = res;
    });
    // console.log('CHECK', snooze);
    if (snooze === 'false' && d > BOUNDARY) {
      await AsyncStorage.setItem('snooze', 'true');
      await AsyncStorage.getItem('attack').then(async (res) => {
        if (res === 'false') {
          console.log('SETTING');
          I3 = setInterval(this.check, 900000); //test it hard
          console.log('I3', I3);
          this.setState({timer: I3});
          await AsyncStorage.setItem('attack', 'true');
        }
      });

      var button = [
        {
          text: 'Cancel',
          onPress: () => {
            this.setState({visible: true});
          },
        },
      ];
      Alert.alert('You have Broken LockDown', 'Please Stay Home');
      PushNotification.cancelAllLocalNotifications();
      PushNotification.localNotification({
        /* Android Only Properties */
        smallIcon: 'lock', // (optional) default: "ic_notification" with fallback for "ic_launcher"
        bigText: 'You have broken Lockdown', // (optional) default: "message" prop
        subText: 'Please Stay Indoors', // (optional) default: none
        vibrate: true, // (optional) default: true
        vibration: 10, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        tag: 'Please stay Indoors', // (optional) add tag to message
        group: 'group', // (optional) add group to message
        ongoing: false, // (optional) set whether this is an "ongoing" notification
        priority: 'low', // (optional) set notification priority, default: high
        visibility: 'private', // (optional) set notification visibility, default: private
        importance: 'high', // (optional) set notification importance, default: high
        allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
        ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear)

        /* iOS and Android properties */
        title: 'Warning ', // (optional)
        message: 'You have broken  LockDown !\nYou should stay Inside !', // (required)
        playSound: true, // (optional) default: true
        // soundName: 'android.resource://com.reactnativemapview/raw/woosh', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
        soundName: 'default',
        number: 1, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
        actions: '["Ok"]', // (Android only) See the doc for notification actions to know more
      });
    }

    // setInterval(() => {
    //   this.setState({rkey: this.state.rkey === 0 ? 1 : 0});
    // }, 200);
  };

  setHome = async () => {
    this.setState({home: true});
    this.setState({loading: false});
    I1 = setInterval(this.getLocation, 5000);
    I2 = setInterval(this.validate, 5000);
    var disable = 0;
    await AsyncStorage.getItem('disable').then((res) => {
      if (res === 'true') {
        console.log('DISABLED');
        disable = 1;
      } else {
        console.log('RESPONSE', res);
      }
    });
    if (!BackgroundService.isRunning() && disable === 0) {
      this.startJob();
    }
    console.log('mounted');
    // BackgroundTask.schedule({
    //   period: 900,
    // });
  };
  async componentDidMount() {
    // AsyncStorage.removeItem('latitude');
    // AsyncStorage.removeItem('attack');
    await AsyncStorage.getItem('disable').then(async (res) => {
      if (res === 'true') {
        this.setState({disabled: true});
      } else {
        this.setState({disabled: false});
      }
    });
    await AsyncStorage.setItem('snooze', 'false');
    await this.getData();
    if (this.state.homeLat !== null && this.state.homeLng !== null) {
      this.setHome();
    } else {
      this.getLocation(true);
    }
  }
  render() {
    return this.state.loading === true ? (
      <>
        <Image
          source={loader}
          style={{
            ...styles.image,
            width: width,
            height: height,
          }}
        />
      </>
    ) : this.state.home ? (
      <>
        {/* <TouchableOpacity
          onPress={() => {
            console.log('press');
          }}> */}
        <BottomNavigation
          key={this.state.rkey}
          shifting
          navigationState={this.state.data}
          onIndexChange={(index) => {
            this._handleIndexChange(index);
          }}
          renderScene={this._renderScene}
        />
        {/* </TouchableOpacity> */}
      </>
    ) : (
      <View style={{flex: 1}}>
        <LocationView
          key={this.state.lkey}
          apiKey="AIzaSyBmxU0P0h6uQTANkaBKbmRdHjZZe4iRfXA"
          use
          initialLocation={{
            latitude: this.state.initialPosition.latitude,
            longitude: this.state.initialPosition.longitude,
          }}
          onLocationSelect={(obj) => {
            this.storeData(obj.latitude, obj.longitude);
          }}
        />
        {/* <Text>{this.state.initialPosition.latitude}</Text> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  image: {
    flex: 1,
    // height: height,
    resizeMode: 'cover',
    backgroundColor: 'black',
    // justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    backgroundColor: 'white',
    right: 0,
    bottom: 0,
  },
});

export default memo(Home);
