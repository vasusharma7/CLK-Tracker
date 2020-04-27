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
import image from '../assets/1.jpg';
import {Surface, Appbar} from 'react-native-paper';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
const {width, height} = Dimensions.get('window');
const initialLayout = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  backgroundColor: 'black',
};

const axios = require('axios');
export default function WorldScreen() {
  const [routes] = React.useState([
    {key: 'summary', title: 'Summary'},
    {key: 'graph', title: 'Graph'},
  ]);

  const [index, setIndex] = useState(0);
  var [wCases, setwCases] = useState({});
  var [vkey, setVkey] = useState(0);
  var [dkey, setDkey] = useState(0);
  var [change, setChange] = useState(false);
  var [data, setData] = useState([]);
  var buffer = change;
  useEffect(() => {
    axios
      .get('https://api.covid19api.com/summary')
      .then((response) => {
        // console.log(Object.keys(response.data));

        setwCases(response.data.Countries);

        var pieData = [];
        var values = [];

        if (data.length === 0 || buffer !== change) {
          var total = response.data.Global.TotalConfirmed;

          Object.keys(wCases).map((key) => {
            var temp = {};
            // var ind = '#' + Math.floor(Math.random() * 16777215).toString(16);
            var ind = colors[Math.floor(Math.random() * colors.length)];
            temp['color'] = ind;
            temp['name'] = wCases[key]['Country'];
            temp['cases'] = wCases[key]['TotalConfirmed'];
            if (parseInt(temp['cases']) / total < 0.05) {
              return;
            }
            temp['legendFontColor'] = ind;
            temp['legendFontSize'] = 10;
            pieData.push(temp);
          });

          console.log(0.05, pieData);
          setData(pieData);
          dkey === 0 ? setDkey(1) : setDkey(0);
        }
        if (wCases === {} || buffer !== change) {
          // setChange(false);
          vkey === 0 ? setVkey(1) : setVkey(0);
        }
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

                {/* </TouchableOpacity> */}
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
    strokeWidth: 2, // optional, default 3
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
      <PieChart
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
        <Appbar.Content title="Country Wise Data" subtitle="In Text" />
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
};
