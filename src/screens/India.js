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
} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
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
} from 'react-native-paper';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import {set} from 'react-native-reanimated';
const {width, height} = Dimensions.get('window');

const initialLayout = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  backgroundColor: 'black',
};

const axios = require('axios');
export default function India() {
  const [routes] = React.useState([
    {key: 'summary', title: 'Summary'},
    {key: 'states', title: 'States'},
    {key: 'graph', title: 'Graphs'},
  ]);

  const [index, setIndex] = useState(0);
  var [iCases, setiCases] = useState({});
  var [vkey, setVkey] = useState(0);
  var [dkey, setDkey] = useState(0);
  var [change, setChange] = useState(false);
  var [data, setData] = useState([]);
  var [linedata, setlineData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  });
  var [lkey, setLKey] = useState(0);
  var [latest, setLatest] = useState([]);
  var [visible, setVisible] = useState('Hide');

  var buffer = change;
  useEffect(() => {
    axios
      .get('https://api.covid19api.com/country/India')
      .then((response) => {
        // console.log(Object.keys(response.data));
        // console.log(response.data.length);
        if (response.data) {
          setiCases(response.data);
          if (iCases[iCases.length - 1] !== undefined)
            setLatest(iCases[iCases.length - 1]);
          // console.log('here', iCases[iCases.length - 1]);
          var heatData = [];
          var values = [];
          var ldata = {};
          ldata['labels'] = [];
          ldata['datasets'] = [];
          var tempA = {};
          tempA['data'] = [];
          Object.keys(iCases).map((key) => {
            var temp = {};
            var date = iCases[key].Date.toString();
            temp['date'] = date.substring(0, date.length - 10);
            ldata['labels'].push(date.substring(0, date.length - 10));
            tempA['data'].push(iCases[key].Confirmed);
            temp['count'] = iCases[key].Confirmed;
            heatData.push(temp);
          });
          setData(heatData);
          ldata['datasets'].push(tempA);
          ldata['datasets'][0] = {
            ...ldata['datasets'][0],
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          };
          console.log(ldata);
          setlineData(ldata);

          if (data.length === 0 || buffer !== change) {
            dkey === 0 ? setDkey(1) : setDkey(0);
            lkey === 0 ? setLKey(1) : setLKey(0);
          }
          if (
            JSON.stringify(iCases) === JSON.stringify({}) ||
            buffer !== change
          ) {
            vkey === 0 ? setVkey(1) : setVkey(0);
          }
        }
      })
      .catch((err) => {
        console.log('error', err);
      });
  }, [dkey, vkey, change]);

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

  const Graph = () => (
    <View
      style={{
        backgroundColor: 'black',
        // height: height,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        padding: 0,
      }}>
      <ContributionGraph
        values={data}
        endDate={tempObj.setDate(dateObj.getDate() - 1)}
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
            showData.date = 'Pre-Covid';
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
  );

  const Stats = () => {
    return (
      <>
        <Line />
      </>
    );
  };
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
          {latest.length === 0 ? (
            <></>
          ) : (
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

              {Graph()}
              <Paragraph style={{color: 'white', marginTop: 10}}>
                Touch to view Status
              </Paragraph>
            </>
          )}
        </ScrollView>
      </ImageBackground>
    </>
  );

  const renderScene = SceneMap({
    summary: Summary,
    states: () => <States />,
    graph: Stats,
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
        <Appbar.Content title="India" subtitle="In Text" />
      </Appbar.Header>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
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
};
