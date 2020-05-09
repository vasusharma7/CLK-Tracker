/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ImageBackground,
  AsyncStorage,
} from 'react-native';
import image from '../assets/1.gif';
import BottomSheet from './BottomSheet';
import {Surface, FAB} from 'react-native-paper';
const {width, height} = Dimensions.get('window');
import RBSheet from 'react-native-raw-bottom-sheet';
const axios = require('axios');
export default function States() {
  const refRBSheet = useRef();
  const [index, setIndex] = useState(0);
  var [sCases, setsCases] = useState('');
  var [vkey, setVkey] = useState(0);
  var [dkey, setDkey] = useState(0);
  var [change, setChange] = useState(false);

  var [buffer, setBuffer] = useState(false);
  var [data, setData] = useState([]);
  var [visible, setVisible] = useState(false);
  var [fetch, setFetch] = useState('');
  const fetchDate = async () => {
    var currentdate = new Date();
    var datetime =
      'Last Sync: ' +
      currentdate.getDate() +
      '/' +
      (currentdate.getMonth() + 1) +
      '/' +
      currentdate.getFullYear() +
      ' @ ' +
      currentdate.getHours() +
      ':' +
      currentdate.getMinutes() +
      ':' +
      currentdate.getSeconds();
    await AsyncStorage.setItem('ind_date', JSON.stringify(datetime));
  };

  const fetchData = async () => {
    try {
      await axios
        .get('https://api.covid19india.org/state_district_wise.json')
        .then(async (response) => {
          fetchDate();
          await AsyncStorage.getItem('state_dump').then(async (res) => {
            if (res === JSON.stringify(response.data) && change === buffer) {
              await AsyncStorage.getItem('state_data').then((res2) => {
                if (res2 !== null) {
                  setsCases(JSON.parse(res2));
                }
              });
            } else {
              if (change !== buffer) {
                setBuffer(!buffer);
              }
              var dump = response.data;
              await AsyncStorage.setItem('state_dump', JSON.stringify(dump));
              var state_data = {},
                act = 0,
                conf = 0,
                rec = 0,
                deaths = 0,
                k = 0;
              Object.keys(dump).map((state) => {
                act = conf = rec = deaths = 0;
                Object.keys(dump[state].districtData).map((dist) => {
                  conf += dump[state].districtData[dist].confirmed;
                  rec += dump[state].districtData[dist].recovered;
                  deaths += dump[state].districtData[dist].deceased;
                  act += dump[state].districtData[dist].active;
                });
                state_data[k] = {
                  name: state,
                  confirmed: conf,
                  active: act,
                  recovered: rec,
                  deaths: deaths,
                };
                k++;
              });
              setsCases(state_data);
              vkey === 0 ? setVkey(1) : setVkey(0);
              console.log(state_data);
              await AsyncStorage.setItem(
                'state_data',
                JSON.stringify(state_data),
              );
            }
          });
        })
        .catch(async (err) => {
          Alert.alert(
            'Sorry Recent Data Could Not Be Fetched',
            'Try Again Later',
          );
          console.log('error', err);
          AsyncStorage.getItem('state_dump').then((res) => {
            if (res !== null) {
              AsyncStorage.getItem('state_data').then((res2) => {
                setsCases(JSON.parse(res2));
              });
            }
          });
        });
    } catch {
      Alert.alert('Sorry Recent Data Could Not Be Fetched', 'Try Again Later');
    }
  };
  useEffect(() => {
    fetchData();
  }, [change]);

  return (
    <>
      <ImageBackground source={image} style={styles.image}>
        <ScrollView
          contentContainerStyle={{
            // flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'black',
            padding: 50,
          }}
          key={vkey}>
          {Object.keys(sCases).map((key) => {
            // console.log(sCases[key].Country);
            return (
              <React.Fragment key={key}>
                <TouchableOpacity
                  onPress={() => {
                    setFetch(sCases[key].name);
                    refRBSheet.current.open();
                  }}>
                  <Surface style={styles.surface}>
                    <View style={{flexDirection: 'row', padding: 1}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          padding: 1,
                          marginRight: 10,
                          marginLeft: 0,
                          alignContent: 'center',
                          justifyContent: 'center',
                          flex: 1,
                          alignSelf: 'center',
                        }}>
                        <Text
                          style={{
                            ...styles.text,
                            fontSize: 15,
                            textAlign: 'center',
                            color: '#eee',
                          }}>
                          {sCases[key].name}
                        </Text>
                      </View>

                      <View style={{flexDirection: 'column', flex: 1}}>
                        <Text style={{...styles.text, color: 'gray'}}>
                          Active - {sCases[key].active}
                        </Text>
                        <Text style={{...styles.text, color: 'white'}}>
                          Confirmed - {sCases[key].confirmed}
                        </Text>
                        <Text style={{...styles.text, color: '#00dd00'}}>
                          Recovered - {sCases[key].recovered}
                        </Text>
                        <Text style={{...styles.text, color: '#d00'}}>
                          Deaths - {sCases[key].deaths}
                        </Text>
                      </View>
                    </View>
                  </Surface>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </ScrollView>
        <FAB
          style={styles.fab}
          small
          icon="refresh"
          onPress={() => setChange(!change)}
        />
        <RBSheet
          animationType={'slide'}
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          closeOnPressBack={true}
          height={Math.floor((3 * height) / 5)}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
            container: {
              backgroundColor: 'rgba(200,200,200,0.8)',
            },
          }}>
          {console.log('Hi')}
          <BottomSheet state={fetch} />
        </RBSheet>
      </ImageBackground>
    </>
  );
}
var styles = {
  fab: {
    position: 'absolute',
    margin: 16,
    backgroundColor: 'white',
    right: 0,
    bottom: 0,
  },
  surface: {
    margin: 7,
    padding: 8,
    height: 80,
    opacity: 0.9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(40,65,80,0.6)',
    backgroundColor: 'rgba(20,20,20,0.8)',
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  // rgb(0, 255, 191)
  // rgb(255, 102, 140)
  image: {
    flex: 1,
    // height: height,
    resizeMode: 'cover',
    backgroundColor: 'black',
    // justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
};
