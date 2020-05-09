/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  ImageBackground,
  AsyncStorage,
  Image,
} from 'react-native';
import {ProgressChart} from 'react-native-chart-kit';
import image from '../assets/covid.png';
import loader from '../assets/loader.gif';
import {Surface, Appbar, FAB, Headline} from 'react-native-paper';
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
    setDate(datetime);
    await AsyncStorage.setItem('hs_date', JSON.stringify(datetime));
  };
  const [routes] = React.useState([
    {key: 'summary', title: 'Summary'},
    {key: 'graph', title: 'Graph'},
  ]);
  var [date, setDate] = useState('');

  const [index, setIndex] = useState(0);
  var [loading, setLoading] = useState(true);
  var [gCases, setGCases] = useState({});
  var [vkey, setVkey] = useState(0);
  var [dkey, setDkey] = useState(0);
  var [change, setChange] = useState(false);
  var [buffer, setbuffer] = useState(false);

  var [data, setData] = useState({
    labels: ['1', '1', '1'],
    data: [0, 0, 0],
  });
  const fetchData = async () => {
    try {
      await axios
        .get('https://api.covid19api.com/summary')
        .then(async (response) => {
          fetchDate();
          setLoading(true);
          await AsyncStorage.getItem('summary_data').then(async (res) => {
            if (
              res === JSON.stringify(response.data.Global) &&
              change === buffer
            ) {
              setGCases(JSON.parse(res));
              await AsyncStorage.getItem('summary_graph').then((res2) => {
                if (res != null) setData(JSON.parse(res2));
              });
              setLoading(false);
            } else {
              if (change !== buffer) {
                setbuffer(!buffer);
              }
              console.log('SUMMARY DATA BEING FETHCED');
              setGCases(response.data.Global);
              await AsyncStorage.setItem(
                'summary_data',
                JSON.stringify(response.data.Global),
              );
              vkey === 0 ? setVkey(1) : setVkey(0);
              var keys = ['Confirmed', 'Recovered', 'Deaths'];
              var values = [];
              var dump = response.data.Global;
              keys.map((key) => {
                values.push(dump['Total' + key]);
              });
              console.log('values', values);
              var total = values.reduce(function (a, b) {
                return a + b;
              }, 0);
              values = values.map((value) => {
                return value / total;
              });
              setData({labels: keys, data: values});
              await AsyncStorage.setItem(
                'summary_graph',
                JSON.stringify({
                  labels: keys,
                  data: values,
                }),
              );

              console.log('data', data);
              dkey === 0 ? setDkey(1) : setDkey(0);

              console.log(Object.keys(gCases));
              setLoading(false);
            }
          });
        })
        .catch(async (err) => {
          console.log('error', err);
          await AsyncStorage.getItem('summary_data').then(async (res) => {
            if (res != null) {
              setGCases(JSON.parse(res));
              await AsyncStorage.getItem('summary_graph').then(async (res2) => {
                if (res != null) {
                  setData(JSON.parse(res2));
                  await AsyncStorage.setItem('hs_date').then(async (res3) => {
                    setDate(res3);
                  });
                }
              });
            }
          });
          setLoading(false);
          Alert.alert(
            'Sorry Recent Data Could Not Be Fetched',
            'Try Again Later',
          );
        });
    } catch {
      setLoading(false);
      Alert.alert('Sorry Recent Data Could Not Be Fetched', 'Try Again Later');
    }
  };
  useEffect(() => {
    fetchData();
  }, [change]);
  const Summary = () => (
    <>
      <ImageBackground source={image} style={styles.image}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            maxHeight: height,
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'black',
            padding: 50,
          }}>
          <Surface style={styles.surface} key={vkey + 1}>
            <Text style={styles.text}>
              Total Confirmed - {gCases['TotalConfirmed']}
            </Text>
          </Surface>
          <Surface style={styles.surface} key={vkey + 2}>
            <Text style={styles.text}>
              Total Recovered - {gCases['TotalRecovered']}
            </Text>
          </Surface>
          <Surface style={styles.surface} key={vkey + 3}>
            <Text style={styles.text}>
              Total Deaths - {gCases['TotalDeaths']}
            </Text>
          </Surface>
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
      key={dkey}
      style={{
        backgroundColor: 'black',
        height: height,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        padding: 0,
        margin: 0,
      }}>
      <Headline style={{color: 'white'}}>COVID-19 Condition</Headline>
      <ProgressChart
        key={dkey}
        data={data}
        width={width + 10}
        height={250}
        strokeWidth={8}
        radius={15}
        chartConfig={chartConfig}
        hideLegend={false}
        style={{
          transform: [{translateX: -width * 0.1}],
        }}
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
        <Appbar.Content title="Summary" subtitle={date} />
      </Appbar.Header>
      {loading === true ? (
        <Image
          source={loader}
          style={{
            ...styles.image,
            width: width,
            height: height,
          }}
        />
      ) : (
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
        />
      )}
      {loading === true ? (
        <></>
      ) : (
        <FAB
          style={styles.fab}
          small
          icon="refresh"
          onPress={() => setChange(!change)}
        />
      )}
    </>
  );
}

const styles = {
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
