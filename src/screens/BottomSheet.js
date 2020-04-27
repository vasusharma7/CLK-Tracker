/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, Dimensions} from 'react-native';
const {height, width} = Dimensions.get('window');
import {Surface, Headline} from 'react-native-paper';
import axios from 'axios';
export default function BottomSheet({state}) {
  if (state.length === 0) return <></>;
  var [data, setData] = useState([]);
  var [target, setTarget] = useState('');
  var [key, setKey] = useState(0);

  useEffect(() => {
    axios
      .get('https://api.covid19india.org/state_district_wise.json')
      .then((res) => {
        var dump = res.data[state].districtData;
        if (dump) {
          setData(dump);
          console.log(dump);
        }
      })
      .catch((err) => console.log(err));
    if (target.localeCompare(state) !== 0) {
      setTarget(state);
      key === 0 ? setKey(1) : setKey(0);
      console.log('object');
    }
  }, [key]);

  return (
    <>
      <ScrollView
        contentContainerStyle={{
          // flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'black',
          padding: 40,
        }}
        key={key}>
        <Headline>{state.toUpperCase()}</Headline>
        <Text style={{color: 'black', margin: 10}}>
          (Touch and Hold, then Drag)
        </Text>
        {Object.keys(data).map((key) => {
          // console.log(sCases[key].Country);
          var current = Object.keys(data).findIndex((val) => val === key);
          return (
            <React.Fragment key={key}>
              {/* <TouchableOpacity
                onPress={() => {
                  change === true ? setChange(false) : setChange(true);
                  buffer = change;
                }}> */}

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
                      {key}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'column', flex: 1}}>
                    <Text style={{...styles.text, color: 'gray'}}>
                      Active - {data[key].active}
                    </Text>
                    <Text style={{...styles.text, color: 'white'}}>
                      Confirmed - {data[key].confirmed}
                    </Text>
                    <Text style={{...styles.text, color: '#00dd00'}}>
                      Recovered - {data[key].recovered}
                    </Text>
                    <Text style={{...styles.text, color: '#d00'}}>
                      Deaths - {data[key].deceased}
                    </Text>
                  </View>
                </View>
              </Surface>
            </React.Fragment>
          );
        })}
      </ScrollView>
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
