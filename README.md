# CLK - Tracker

Covid 19 LockDown Tracker : 
An android App built in React Native to track if you stay indoors and obey lock-down. It is based on location based alarm concept. The app will start beeping and will give you periodic notifications if you move at a certain distance away from your home.

On first Install, set your home location and thereafter the app will track you.
The app is not a surveillance app. The location information is just on your phone and not sent to any server.

In addition to that, the app also shows current Corona Virus Statistics such as Summary, Country wise data, Stats related to India, Indian states and Provinces along with Heat Maps and Graphs. 

## API Sources Used for Data
``` bash
1. https://api.covid19india.org
2. https://api.covid19api.com

```
## Libraries 

1. React Native Location View - Modified the library for custom markers and callbacks.

RN Location View Library taken from-
[react-native location view](https://github.com/superapp/react-native-location-view/)

2. React Native Push Notifications

3. React Native Background Actions


## Installation

```bash
git clone https://github.com/vasusharma7/CLK-Tracker.git
cd ClK-Tracker
npm install
Customized React Native Location View is available in the node_modules folder.
```
## Before running the app on android device

``` react-native
1. Connect your deivce to the PC.
2. Turn on USB-Debugging in the Developer Options
3. Open command-prompt and type - 
4. adb devices
```

## Usage

``` react-native
react-native run-android
```
## Screenshots
![](https://github.com/vasusharma7/CLK-Tracker/blob/master/screenshots/1.jpg) ![](https://github.com/vasusharma7/CLK-Tracker/blob/master/screenshots/2.jpg) ![](https://github.com/vasusharma7/CLK-Tracker/blob/master/screenshots/3.jpg) ![](https://github.com/vasusharma7/CLK-Tracker/blob/master/screenshots/4.jpg) ![](https://github.com/vasusharma7/CLK-Tracker/blob/master/screenshots/5.jpg) ![](https://github.com/vasusharma7/CLK-Tracker/blob/master/screenshots/6.jpg) ![](https://github.com/vasusharma7/CLK-Tracker/blob/master/screenshots/7.jpg) ![](https://github.com/vasusharma7/CLK-Tracker/blob/master/screenshots/8.jpg) ![](https://github.com/vasusharma7/CLK-Tracker/blob/master/screenshots/9.jpg) ![](https://github.com/vasusharma7/CLK-Tracker/blob/master/screenshots/10.jpg) ![](https://github.com/vasusharma7/CLK-Tracker/blob/master/screenshots/11.jpg) 


## Contributing
Pull requests are welcome.

## License
[MIT](https://choosealicense.com/licenses/mit/)
