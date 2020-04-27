/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  ImageBackground,
} from 'react-native';
import image from '../assets/1.gif';
import BottomSheet from './BottomSheet';
import {Surface, Modal, Portal, Provider} from 'react-native-paper';
const {width, height} = Dimensions.get('window');
import RBSheet from 'react-native-raw-bottom-sheet';
const axios = require('axios');
export default function States() {
  const refRBSheet = useRef();
  const [index, setIndex] = useState(0);
  var [sCases, setsCases] = useState({});
  var [vkey, setVkey] = useState(0);
  var [dkey, setDkey] = useState(0);
  var [change, setChange] = useState(false);
  var [data, setData] = useState([]);
  var [visible, setVisible] = useState(false);
  var [fetch, setFetch] = useState('');

  var buffer = change;
  useEffect(() => {
    axios
      .get(
        'https://covid-19-india-data-by-zt.p.rapidapi.com/GetIndiaStateWiseData',
        {
          headers: {
            'x-rapidapi-key':
              '2d1c7465a6msh17f8a1f5b7a193fp190be2jsn0e669c6f9818',
            'x-rapidapi-host': 'covid-19-india-data-by-zt.p.rapidapi.com',
          },
        },
      )
      .then((response) => {
        // console.log(Object.keys(response.data));

        setsCases(response.data.data);

        if (sCases === {} || buffer !== change) {
          vkey === 0 ? setVkey(1) : setVkey(0);
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
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
                {/* <TouchableOpacity
                onPress={() => {
                  change === true ? setChange(false) : setChange(true);
                  buffer = change;
                }}> */}
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
        <RBSheet
          animationType={'slide'}
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          closeOnPressBack={true}
          height={Math.floor((3 * height) / 4)}
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
