import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import image from '../assets/covid.png';
import {Surface, Appbar} from 'react-native-paper';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
const {width, height} = Dimensions.get('window');
const colors = ['red', 'blue', 'green', 'orange'];
const initialLayout = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  backgroundColor: 'black',
};

const axios = require('axios');
export default function HomeScreen() {
  const [routes] = React.useState([
    {key: 'summary', title: 'Summary'},
    {key: 'graph', title: 'Graph'},
  ]);

  const [index, setIndex] = useState(0);
  var [gCases, setGCases] = useState({});
  var [vkey, setVkey] = useState(0);
  var [dkey, setDkey] = useState(0);
  var [change, setChange] = useState(false);
  var [data, setData] = useState({
    labels: ['1', '2', '3'], // optional
    data: [0, 0, 0],
  });
  var buffer = change;
  useEffect(() => {
    axios
      .get('https://api.covid19api.com/summary')
      .then((response) => {
        // console.log(Object.keys(response.data));

        setGCases(response.data.Global);
        var keys = [];
        var values = [];
        var sum = data['data'].reduce((a, b) => a + b, 0);
        if (sum === 0 || buffer !== change) {
          console.log('hi');
          Object.keys(gCases).map((key) => {
            keys.push(key.toString());
            values.push(gCases[key]);
          });
          console.log('values', values);
          var total = values.reduce(function (a, b) {
            return a + b;
          }, 0);
          values = values.map((value) => {
            return value / total;
          });
          setData({labels: keys, data: values, color: ['red', 'blue']});
          console.log('data', data);
          dkey === 0 ? setDkey(1) : setDkey(0);
        }
        if (gCases === {} || buffer !== change) {
          // setChange(false);
          vkey === 0 ? setVkey(1) : setVkey(0);
        }
        console.log(Object.keys(gCases));
      })
      .catch((err) => {
        console.log('error', err);
      });
  }, [vkey, dkey, change]);
  const Summary = () => (
    <>
      <ImageBackground source={image} style={styles.image}>
        <ScrollView
          contentContainerStyle={{
            // flex: 1,
            maxHeight: height,
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'black',
            padding: 50,
          }}
          key={vkey}>
          {Object.keys(gCases).map((key) => {
            console.log(key);
            return (
              <>
                {/* <TouchableOpacity
                onPress={() => {
                  change === true ? setChange(false) : setChange(true);
                  buffer = change;
                }}> */}
                <Surface style={styles.surface} key={key}>
                  <Text style={styles.text}>
                    {key} - {gCases[key]}
                  </Text>
                </Surface>
                {/* <Surface style={styles.surface}>
                <Text key={key.toString() + '1'}>
                  {key} - {gCases[key]}
                </Text>
              </Surface> */}
                {/* </TouchableOpacity> */}
              </>
            );
          })}
        </ScrollView>
      </ImageBackground>
    </>
  );
  const chartConfig = {
    backgroundGradientFrom: 'black',
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: 'black',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.9,
    paddingRight: 10,
    useShadowColorFromDataset: false, // optional
  };
  const Graph = () => (
    <View
      style={{
        backgroundColor: 'black',
        height: height,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        padding: 0,
      }}>
      <ProgressChart
        renderVerticalLabels={{
          data: [1, 5, 7],
          width: Number,
          // height of your chart
          height: Number,
          paddingTop: Number,
          paddingRight: Number,
        }}
        key={dkey}
        data={data}
        width={width}
        height={250}
        strokeWidth={8}
        radius={35}
        chartConfig={chartConfig}
        hideLegend={false}
      />
    </View>
  );

  const renderScene = SceneMap({
    summary: Summary,
    graph: Graph,
  });
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: 'white'}}
      style={{backgroundColor: '#222'}}
    />
  );
  return (
    <>
      <Appbar.Header
        dark
        statusBarHeight={5}
        style={{backgroundColor: '#222', textAlign: 'center'}}>
        <Appbar.Content title="Summary" subtitle="In Text" />
      </Appbar.Header>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
    </>
  );
}

const styles = {
  surface: {
    margin: 7,
    padding: 8,
    height: 80,
    opacity: 0.9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: '#666',
    width: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 100,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    // height: height,
    resizeMode: 'cover',
    backgroundColor: 'black',
    // justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
};
