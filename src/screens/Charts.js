/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, Dimensions} from 'react-native';
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
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Rainy Days', 'Sunny Days', 'Snowy Days'],
  });
  var [key, setKey] = useState(0);

  useEffect(() => {
    axios
      .get('https://api.covid19api.com/country/India')
      .then((response) => {
        if (response.data) {
          var cases = response.data;

          var ldata = {};
          ldata['labels'] = [];
          ldata['datasets'] = [];
          var temp = {};
          temp['data'] = [];
          Object.keys(cases).map((key) => {
            var date = cases[key].Date.toString();
            if (cases[key].Confirmed < 2000) return;
            temp['data'].push(cases[key].Confirmed);
            ldata['labels'].push(date.substring(0, date.length - 10));
          });
          ldata['datasets'].push(temp);
          //   console.log(ldata);
          setData(ldata);

          if (
            JSON.stringify(data) ===
            JSON.stringify({
              labels: ['January', 'February', 'March', 'April', 'May', 'June'],
              datasets: [
                {
                  data: [20, 45, 28, 80, 99, 43],
                  color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                  strokeWidth: 2, // optional
                },
              ],
              legend: ['Rainy Days', 'Sunny Days', 'Snowy Days'], // optional
            })
          ) {
            key === 0 ? setKey(1) : setKey(0);
          }
        }
      })
      .catch((err) => console.log(err));
  }, [key]);

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
          width={width * 2}
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
