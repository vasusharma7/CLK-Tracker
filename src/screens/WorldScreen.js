/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  ScrollView,
  Alert,
  Dimensions,
  ImageBackground,
  AsyncStorage,
  Image,
} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
var colors = [
  '#CB3301',
  '#FF0066',
  '#FF6666',
  '#FEFF99',
  '#FFFF67',
  '#CCFF66',
  '#99FE00',
  '#EC8EED',
  '#FF99CB',
  '#FE349A',
  '#CC99FE',
  '#6599FF',
  '#03CDFF',
  '#FFFFFF',
];
import image from '../assets/back1.jpg';
import loader from '../assets/loader.gif';
import {Surface, Appbar, Headline, FAB} from 'react-native-paper';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
const {width, height} = Dimensions.get('window');
const initialLayout = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  backgroundColor: 'black',
};

const axios = require('axios');
var dump = 0;
export default function WorldScreen() {
  const [routes] = React.useState([
    {key: 'summary', title: 'Summary'},
    {key: 'graph', title: 'Graph'},
  ]);

  const [index, setIndex] = useState(0);
  var [loading, setLoading] = useState(true);
  var [wCases, setwCases] = useState('');
  var [data, setData] = useState([]);
  var [vkey, setVkey] = useState(0);
  var [dkey, setDkey] = useState(0);
  var [change, setChange] = useState(false);

  var [buffer, setBuffer] = useState(false);
  var [date, setDate] = useState('');
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
    await AsyncStorage.setItem('ws_date', JSON.stringify(datetime));
  };
  const fetchData = async () => {
    try {
      await axios
        .get('https://api.covid19api.com/summary')
        .then(async (response) => {
          fetchDate();
          setLoading(true);
          await AsyncStorage.getItem('countries_data').then(async (res) => {
            if (
              res === JSON.stringify(response.data.Countries) &&
              buffer === change
            ) {
              console.log('I AM HERE');
              setwCases(JSON.parse(res));
              await AsyncStorage.getItem('countries_graph').then((res2) => {
                if (res != null) {
                  setData(JSON.parse(res2));
                }
              });
              setLoading(false);
            } else {
              console.log('REFRESHING');
              if (change !== buffer) {
                setBuffer(!buffer);
              }
              console.log('FETCHING COUNRTY DATA');
              setwCases(response.data.Countries);
              // setLoading(false);

              await AsyncStorage.setItem(
                'countries_data',
                JSON.stringify(response.data.Countries),
              );

              vkey === 0 ? setVkey(1) : setVkey(0);
              var total = response.data.Global.TotalConfirmed;
              var pieData = [];
              var dump = response.data.Countries;
              var pallete = [
                '#CB3301',
                '#FF0066',
                '#FF6666',
                '#FEFF99',
                '#FFFF67',
                '#CCFF66',
                '#99FE00',
                '#EC8EED',
                '#FF99CB',
                '#FE349A',
                '#CC99FE',
                '#6599FF',
                '#03CDFF',
                '#FFFFFF',
              ];
              Object.keys(dump).map((key) => {
                // console.log(key);

                var temp = {};
                // var t = Math.floor(Math.random() * pallete.length);

                temp['cases'] = dump[key]['TotalConfirmed'];
                if (parseInt(temp['cases']) / total < 0.05) {
                  return;
                }
                if (pallete.length === 0)
                  pallete = [
                    '#CB3301',
                    '#FF0066',
                    '#FF6666',
                    '#FEFF99',
                    '#FFFF67',
                    '#CCFF66',
                    '#99FE00',
                    '#EC8EED',
                    '#FF99CB',
                    '#FE349A',
                    '#CC99FE',
                    '#6599FF',
                    '#03CDFF',
                    '#FFFFFF',
                  ];
                console.log(pallete);
                // var ind = colors[Math.floor(Math.random() * colors.length)];
                var t = Math.floor(Math.random() * pallete.length);
                var ind = pallete[t];
                console.log(ind);
                pallete.splice(t, 1);
                temp['color'] = ind;
                temp['name'] = dump[key]['Country'];
                if (temp['name'] === 'United States of America')
                  temp['name'] = 'U.S.A.';
                temp['legendFontColor'] = ind;
                temp['legendFontSize'] = 11;
                pieData.push(temp);
              });

              console.log(0.05, pieData);

              setData(pieData);
              await AsyncStorage.setItem(
                'countries_graph',
                JSON.stringify(pieData),
              );
              console.log('logged');
              dkey === 0 ? setDkey(1) : setDkey(0);
              setLoading(false);
            }
          });
        })
        .catch(async (err) => {
          console.log('error', err);
          await AsyncStorage.getItem('countries_data').then(async (res) => {
            if (res != null) {
              setwCases(JSON.parse(res));
              await AsyncStorage.getItem('countries_graph').then(
                async (res2) => {
                  if (res != null) {
                    setData(JSON.parse(res2));
                    await AsyncStorage.setItem('ws_date').then(async (res3) => {
                      setDate(res3);
                    });
                  }
                },
              );
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
            // flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'black',
            padding: 50,
          }}
          key={vkey}>
          {Object.keys(wCases).map((key) => {
            // console.log(wCases[key].Country);
            return (
              <React.Fragment key={key}>
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
                          color: 'black',
                        }}>
                        {wCases[key].Country}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'column', flex: 1}}>
                      <Text style={{...styles.text, color: 'white'}}>
                        Total Confirmed - {wCases[key].TotalConfirmed}
                      </Text>
                      <Text style={{...styles.text, color: '#00dd00'}}>
                        Total Recovered - {wCases[key].TotalRecovered}
                      </Text>
                      <Text style={{...styles.text, color: '#d00'}}>
                        Total Deaths - {wCases[key].TotalDeaths}
                      </Text>
                    </View>
                  </View>
                </Surface>
              </React.Fragment>
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
    strokeWidth: 3, // optional, default 3
    barPercentage: 0.9,
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
      <>
        <Headline style={{color: 'white'}}>
          Countries with Maximum Cases
        </Headline>
        <PieChart
          key={dkey}
          data={data}
          width={width}
          height={220}
          chartConfig={chartConfig}
          accessor="cases"
          paddingLeft="0"
          backgroundColor="transparent"
          absolute
          hasLegend
        />
      </>
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
        <Appbar.Content title="Country Wise Data" subtitle={date} />
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

var styles = {
  surface: {
    margin: 7,
    padding: 8,
    height: 80,
    opacity: 0.9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgb(0, 255, 191)',
    backgroundColor: 'rgba(40,65,80,0.6)',
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
  fab: {
    position: 'absolute',
    margin: 16,
    backgroundColor: 'white',
    right: 0,
    bottom: 0,
  },
};
