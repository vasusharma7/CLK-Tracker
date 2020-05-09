/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  Alert,
  Text,
  Dimensions,
  AsyncStorage,
} from 'react-native';
const {height, width} = Dimensions.get('window');
import {Surface, Headline} from 'react-native-paper';
import {LineChart, BarChart} from 'react-native-chart-kit';
import axios from 'axios';
import {set} from 'react-native-reanimated';

export default function Line() {
  var [data, setData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  });
  var [key, setKey] = useState(0);

  const fetchData = async () => {
    // await AsyncStorage.removeItem('line_dump');
    try {
      await axios
        .get('https://api.covid19api.com/country/India')
        .then(async (response) => {
          await AsyncStorage.getItem('line_dump').then(async (res) => {
            if (res === JSON.stringify(response.data)) {
              await AsyncStorage.getItem('line_data').then((res2) => {
                if (res2 !== null) {
                  setData(JSON.parse(res2));
                }
              });
            } else {
              var cases = response.data;
              AsyncStorage.setItem('line_dump', JSON.stringify(response.data));
              var ldata = {};
              ldata['labels'] = [];
              ldata['datasets'] = [];
              var temp = {};
              temp['data'] = [];
              Object.keys(cases)
                .slice(0)
                .reverse()
                .map((key) => {
                  if (temp['data'].length > 40) return;
                  var date = cases[key].Date.toString();
                  temp['data'].push(cases[key].Confirmed);
                  ldata['labels'].push(date.substring(0, date.length - 10));
                });
              temp['data'].reverse();
              ldata['labels'].reverse();
              ldata['datasets'].push(temp);
              setData(ldata);
              AsyncStorage.setItem('line_data', JSON.stringify(ldata));
              key === 0 ? setKey(1) : setKey(0);
            }
          });
        })
        .catch(async (err) => {
          console.log('error', err);
          Alert.alert(
            'Sorry Recent Data Could Not Be Fetched',
            'Try Again Later',
          );
          await AsyncStorage.getItem('line_dump').then(async (res) => {
            if (res != null) {
              await AsyncStorage.getItem('line_data').then(async (res2) => {
                if (res != null) {
                  setData(JSON.parse(res2));
                }
              });
            }
          });
        });
    } catch {
      Alert.alert('Sorry Recent Data Could Not Be Fetched', 'Try Again Later');
    }
  };
  useEffect(() => {
    AsyncStorage.removeItem('line_dump');
    fetchData();
  }, []);

  const chartConfig = {
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  return (
    <ScrollView horizontal={true}>
      <View
        style={{
          backgroundColor: 'black',
          paddingRight: 5,
          //   alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
          padding: 0,
        }}>
        <Headline
          style={{
            position: 'absolute',
            alignSelf: 'flex-start',
            textAlign: 'left',
            top: 0,
            color: 'white',
            marginTop: 20,
            marginLeft: 10,
          }}>
          Bar Graph with Dates
        </Headline>
        <BarChart
          key={key}
          withVerticalLabels={true}
          data={data}
          width={width * 3}
          height={400}
          chartConfig={chartConfig}
          verticalLabelRotation={90}
        />
        <Text
          style={{
            textAlign: 'left',
            color: 'white',
            marginTop: 20,
            marginLeft: 10,
          }}>
          (Scroll horizontally)
        </Text>
      </View>
    </ScrollView>
  );
}
