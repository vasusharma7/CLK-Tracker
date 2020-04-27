/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {memo} from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

// const Tab = createMaterialBottomTabNavigator();

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
} from 'react-native';

import BackgroundTask from 'react-native-background-task';
import Geolocation from 'react-native-geolocation-service';
import {BottomNavigation, Appbar} from 'react-native-paper';

import {LocationView} from 'react-native-location-view';

const {width, height} = Dimensions.get('window');

import {India, HomeScreen, WorldScreen} from './';
import {parse} from 'react-native-svg';

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const HomeRoute = () => <HomeScreen />;

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;
var I1, I2;
class Home extends React.Component {
  storeData = async (latitude, longitude) => {
    try {
      // console.log('latitiude', latitude);
      // console.log('longitude', longitude);
      await AsyncStorage.setItem('latitude', latitude.toString());
      await AsyncStorage.setItem('longitude', longitude.toString());
      this.setHome();
      this.getData();
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
        I1 = setInterval(this.getLocation, 1000);
        I2 = setInterval(this.validate, 1000);
        this.state.rkey === 0
          ? this.setState({rkey: 1})
          : this.setState({rkey: 0});
      } else {
        console.log('hello there', this.state.homeLat);
      }
    } catch (e) {
      console.log('getData', e);
    }
  };

  constructor() {
    super();
    this.state = {
      visible: true,
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
      lkey: 0,
      hkey: 0,
      home: false,
      homeLat: null,
      homeLng: null,
      lat: null,
      lng: null,
      rkey: 0,
      activeTab: 'games',
      data: {
        index: 0,
        routes: [
          {
            key: 'settings',
            title: 'Stats/settings',
            icon: 'settings',
            color: '#111',
          },
          {
            key: 'india',
            title: 'India',
            icon: 'home',
            color: '#08130D',
          },
          {
            key: 'summary',
            title: 'Summary',
            icon: 'history',
            color: '#000',
          },
          {key: 'world', title: 'World', icon: 'earth', color: '#333'},
        ],
      },
    };
  }
  Stats = () => (
    <>
      <Appbar.Header
        dark
        statusBarHeight={5}
        style={{backgroundColor: '#111', textAlign: 'center'}}>
        <Appbar.Content title="Track Yourself" subtitle="In Text" />
      </Appbar.Header>
      <View
        style={{
          backgroundColor: 'black',
          flex: 1,
          color: 'white',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: 'white'}}>
          {this.state.lat} ___ {this.state.lng}
        </Text>
        <Text style={{color: 'white'}}>
          {this.state.homeLat} ___ {this.state.homeLng}
        </Text>
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
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission Required',
        message: 'Grant  Access to use the App',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
            console.log('initial', region);
            this.setState({initialPosition: region});
            this.setState({lkey: this.state.lkey === 0 ? 1 : 0});
            if (this.state.homeLat !== null && this.state.homeLng !== null) {
              this.setHome();
              this.state.rkey === 0
                ? this.setState({rkey: 1})
                : this.setState({rkey: 0});
            } else {
              I1 = setInterval(this.getLocation, 1000);
              I2 = setInterval(this.validate, 1000);
            }
          } else {
            this.setState({lat: lat.toString(), lng: lng.toString()});
            this.state.rkey === 0
              ? this.setState({rkey: 1})
              : this.setState({rkey: 0});
          }
          // console.log(this.state.initialPosition);
        },
        (error) => {
          // See error code charts below.
          console.log('Error In Fetching Location', error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000},
      );
    }
  };
  convertio(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }
  validate = () => {
    //home
    console.log(this.state.homeLat);
    console.log(this.state.homeLng);
    console.log(this.state.lat);
    console.log(this.state.lng);
    var lat1 = this.convertio(parseFloat(this.state.homeLat));
    var lon1 = this.convertio(parseFloat(this.state.homeLng));
    //present
    // console.log(this.state.homeLat);
    var lat2 = this.convertio(parseFloat(this.state.lat));
    var lon2 = this.convertio(parseFloat(this.state.lng));
    var R = 6371e3; // metres

    var φ1 = lat1;
    var φ2 = lat2;
    var Δφ = lat2 - lat1;
    var Δλ = lon2 - lon1;
    var a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    if (d > 200 && this.state.visible) {
      this.setState({visible: false});
      var button = [
        {
          text: 'Cancel',
          onPress: () => {
            this.setState({visible: true});
          },
        },
      ];
      Alert.alert('You have Broken LockDown', 'Please Stay Home');
    }
    console.log('distance', d);
  };
  setHome = () => {
    this.setState({home: true});
    I1 = setInterval(this.getLocation, 1000);
    I2 = setInterval(this.validate, 1000);
  };
  async componentDidMount() {
    // AsyncStorage.clear();
    await PermissionsAndroid.request(
      PermissionsAndroid.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
      {
        title: 'Allow App to Run  In Background',
        message: 'Grant  Access to use the App',
      },
    );
    this.getData();
    this.getLocation(true);
  }

  render() {
    return this.state.home ? (
      <>
        {/* <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer> */}
        <BottomNavigation
          key={this.state.rkey}
          shifting
          navigationState={this.state.data}
          onIndexChange={this._handleIndexChange}
          renderScene={this._renderScene}
        />
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
});

export default memo(Home);
