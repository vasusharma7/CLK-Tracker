/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Dimensions,
  ImageBackground,
  AsyncStorage,
} from 'react-native';
import {ContributionGraph} from 'react-native-chart-kit';
var showData = {date: '', count: ''};
var dateObj = new Date();
var tempObj = new Date();
import image from '../assets/3.jpg';
import States from './States';
import Line from './Charts';
import {
  Surface,
  Appbar,
  Snackbar,
  Headline,
  Paragraph,
  FAB,
} from 'react-native-paper';
import loader from '../assets/loader.gif';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
const {width, height} = Dimensions.get('window');

const initialLayout = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  backgroundColor: 'black',
};

const axios = require('axios');

export default function India() {
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
    await AsyncStorage.setItem('ind_date', JSON.stringify(datetime));
  };
  const [routes] = React.useState([
    {key: 'summary', title: 'Summary'},
    {key: 'states', title: 'States'},
    {key: 'graph', title: 'Graphs'},
  ]);

  const [index, setIndex] = useState(0);
  var [iCases, setiCases] = useState({});
  var [vkey, setVkey] = useState(0);
  var [dkey, setDkey] = useState(0);

  var [data, setData] = useState([]);
  var [date, setDate] = useState('');
  var [latest, setLatest] = useState([]);
  var [visible, setVisible] = useState('Hide');
  var [loading, setLoading] = useState(true);
  const fetchData = async () => {
    try {
      await axios
        .get('https://api.covid19api.com/country/India')
        .then((response) => {
          setLoading(true);
          fetchDate();
          AsyncStorage.getItem('India_data').then((res) => {
            if (res === JSON.stringify(response.data)) {
              res = JSON.parse(res);
              setiCases(res);
              setLatest(res[res.length - 1]);
              AsyncStorage.getItem('India_graph').then((res2) => {
                if (res != null) {
                  setData(JSON.parse(res2));
                }
              });
              setLoading(false);
            } else {
              setiCases(response.data);
              var dump = response.data;
              AsyncStorage.setItem('India_data', JSON.stringify(response.data));
              setLatest(dump[dump.length - 1]);
              vkey === 0 ? setVkey(1) : setVkey(0);
              var heatData = [];
              Object.keys(dump).map((key) => {
                var temp = {};
                var date = dump[key].Date.toString();
                temp['date'] = date.substring(0, date.length - 10);
                temp['count'] = dump[key].Confirmed;
                heatData.push(temp);
              });
              setData(heatData);
              dkey === 0 ? setDkey(1) : setDkey(0);
              AsyncStorage.setItem('India_graph', JSON.stringify(heatData));
              setLoading(false);
            }
          });
        })
        .catch(async (err) => {
          console.log('error', err);
          Alert.alert(
            'Sorry Recent Data Could Not Be Fetched',
            'Try Again Later',
          );
          await AsyncStorage.getItem('India_data').then(async (res) => {
            if (res != null) {
              res = JSON.parse(res);
              setiCases(res);
              setLatest(res[res.length - 1]);
              await AsyncStorage.getItem('India_graph').then(async (res2) => {
                if (res != null) {
                  setData(JSON.parse(res2));
                  await AsyncStorage.setItem('ind_date').then(async (res3) => {
                    setDate(res3);
                  });
                }
              });
            }
          });
          setLoading(false);
        });
    } catch {
      setLoading(false);
      Alert.alert('Sorry Recent Data Could Not Be Fetched', 'Try Again Later');
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const chartConfig = {
    backgroundGradientFrom: 'black',
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: 'black',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.9,
    useShadowColorFromDataset: false, // optional
  };

  // const Stats = () => {
  //   return (
  //     <>
  //       <Line />
  //     </>
  //   );
  // };
  const Summary = () => (
    <>
      <ImageBackground style={styles.image}>
        <ScrollView
          contentContainerStyle={{
            // flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'black',
            padding: 50,
          }}>
          {/* {latest.length === 0 ? (
            <></>
          ) : ( */}
          <>
            <Surface style={styles.surface} key={vkey}>
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
                      fontSize: 18,
                      textAlign: 'center',
                      color: 'white',
                    }}>
                    India
                  </Text>
                </View>
                <View style={{flexDirection: 'column', flex: 1}}>
                  <Text style={{...styles.text, color: 'white'}}>
                    Total Confirmed - {latest.Confirmed}
                  </Text>
                  <Text style={{...styles.text, color: '#00dd00'}}>
                    Total Recovered - {latest.Recovered}
                  </Text>
                  <Text style={{...styles.text, color: '#d00'}}>
                    Total Deaths - {latest.Deaths}
                  </Text>
                </View>
              </View>
            </Surface>
            <Headline style={{color: 'white', margin: 10}}>Heat Map</Headline>

            <View
              key={dkey}
              style={{
                backgroundColor: 'black',
                // height: height,
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center',
                padding: 0,
              }}>
              <ContributionGraph
                key={dkey}
                values={data}
                // endDate={tempObj.setDate(dateObj.getDate() - 1)}
                numDays={105}
                width={width}
                height={220}
                gutterSize={2}
                chartConfig={chartConfig}
                showMonthLabels
                onDayPress={(e) => {
                  // console.log(e.date);
                  var bool = 0;
                  data.forEach((ent) => {
                    if (ent.date === e.date) bool = 1;
                  });
                  if (!bool) {
                    showData.date = 'Pre-Covid/Unvailable';
                    showData.count = 0;
                  } else {
                    showData = e;
                  }
                  setVisible('Show');
                }}
                style={{
                  margin: 10,
                  borderColor: 'rgba(26, 255, 146,0.3)',
                  borderWidth: 1,
                }}
              />
            </View>
            <Paragraph style={{color: 'white', marginTop: 10}}>
              Touch to view Status
            </Paragraph>
          </>
          {/* )} */}
        </ScrollView>
      </ImageBackground>
    </>
  );

  const renderScene = SceneMap({
    summary: Summary,
    states: States,
    graph: Line,
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
        <Appbar.Content title="India" subtitle={date} />
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
      {visible === 'Show' ? (
        <Snackbar
          style={{backgroundColor: 'rgba(26, 255, 146,0.3)'}}
          visible={visible}
          onDismiss={() => setVisible('Hide')}
          duration={3000}
          action={{
            label: 'close',
            color: 'white',
            onPress: () => {
              setVisible('Show');
            },
          }}>
          Date: {showData.date} | Confirmed: {showData.count}
        </Snackbar>
      ) : (
        <></>
      )}
    </>
  );
}

var styles = {
  surface: {
    margin: 9,
    padding: 8,
    height: 80,
    opacity: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgb(0, 255, 191)',
    backgroundColor: 'rgba(40,65,80,0)',
    width: width * 0.9,
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
    // width: width,
    backgroundColor: 'black',
    // justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontSize: 13,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    backgroundColor: 'white',
    right: 0,
    bottom: 32,
  },
};
