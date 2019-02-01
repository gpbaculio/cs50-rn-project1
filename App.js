import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  TouchableOpacity,
  Button,
  TextInput
} from 'react-native';

import { secondsToHms } from './utils';

export default class App extends React.Component {
  state = {
    percent: new Animated.Value(0),
    timeRemaining: 5, // seconds
    workDuration: '25:00',
    breakDuration: '05:00',
    start: false,
    time: secondsToHms(5),
    session: 'Work',
    workMinsInput: '25',
    breakMinsInput: '05',
    workSecsInput: '5',
    breakSecsInput: '5',
    startTimer: 0,
    pause: false
  };
  startAnimation = ms => {
    this.animation = Animated.timing(this.state.percent, {
      toValue: width / 2,
      duration: this.state.timeRemaining * 1000
    });
    if (this.state.pause) {
      this.state.percent.stopAnimation(val => {
        this.state.percent.setValue(val);
      });
      clearInterval(this.state.startTimer);
    }
    if (this.state.start) {
      this.animation.start();
      const startTimer = setInterval(() => {
        const time = secondsToHms(this.state.timeRemaining - 1);
        this.setState({
          startTimer,
          pause: false,
          seconds: this.state.timeRemaining - 1,
          timeRemaining: this.state.timeRemaining - 1,
          time
        });
        if (this.state.timeRemaining === 0) {
          this.setState({
            start: false,
            percent: new Animated.Value(0),
            timeRemaining: 5
          });
          clearInterval(this.state.startTimer);
        }
      }, 1000);
    }
  };
  onPlay = ms => {
    this.setState(
      ({ start, seconds }) => {
        if (start && seconds !== 0) {
          return { pause: true, start: false };
        }
        return { start: true };
      },
      () => this.startAnimation(ms)
    );
  };
  onReset = () => {
    console.log('reset');
  };
  handleTimeInput = (key, val) => {
    this.setState({ [key]: val });
  };
  render() {
    console.log('percent', this.state.percent);
    const height = this.state.percent;
    const fillAnim = {
      height
    };
    const {
      start,
      timeRemaining,
      workMinsInput,
      breakMinsInput,
      workSecsInput,
      breakSecsInput,
      session,
      time
    } = this.state;
    console.log('timeRemaining ', timeRemaining);
    return (
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <Text style={styles.timer}>{time}</Text>
          <Animated.View style={[styles.progress, fillAnim]} />
          <Text>{`${session} Time`}</Text>
        </View>
        <View style={styles.controlsContainer}>
          <View style={styles.controls}>
            <Button
              onPress={() => this.onPlay(timeRemaining)}
              title={start ? 'Pause' : 'Start'}
              color="#841584"
            />
            <Button onPress={this.onReset} title="Reset" color="#841584" />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.pause}>Work Time</Text>
            <View style={styles.minsContainer}>
              <Text style={styles.pause}>Mins:</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.minsInput}
                onChangeText={mins => this.handleTimeInput('workMins', mins)}
                value={workMinsInput}
              />
            </View>
            <View style={styles.secsContainer}>
              <Text style={styles.pause}>Secs:</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.secsInput}
                onChangeText={secs => this.handleTimeInput('workSeconds', secs)}
                value={workSecsInput}
              />
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.pause}>Break Time</Text>
            <View style={styles.minsContainer}>
              <Text style={styles.pause}>Mins:</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.minsInput}
                onChangeText={mins => this.handleTimeInput('breakMins', mins)}
                value={breakMinsInput}
              />
            </View>
            <View style={styles.secsContainer}>
              <Text style={styles.pause}>Secs:</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.secsInput}
                onChangeText={secs =>
                  this.handleTimeInput('breakSeconds', secs)
                }
                value={breakSecsInput}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  minsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  minsInput: {
    marginLeft: 5,
    borderColor: 'gray',
    borderWidth: 1,
    height: 20,
    width: 30
  },
  secsContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  secsInput: {
    marginLeft: 5,
    borderColor: 'gray',
    borderWidth: 1,
    height: 20,
    width: 30
  },
  controlsContainer: {
    width: width * 0.8,
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
    borderColor: 'black',
    borderWidth: 1
  },
  timeContainer: {
    flexDirection: 'row',
    width: width * 0.8,
    justifyContent: 'space-around',
    marginTop: 20
  },
  controls: {
    flexDirection: 'row',
    // borderColor: 'black',
    // borderWidth: 3,
    width: width * 0.4,
    justifyContent: 'space-around'
  },
  progress: {
    backgroundColor: '#FF0000',
    width: '100%',
    bottom: 0,
    position: 'absolute',
    zIndex: 0
  },
  timer: {
    zIndex: 1
  },
  progressContainer: {
    width: width / 2,
    height: width / 2,
    borderRadius: width / 2,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: '#FF0000',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
