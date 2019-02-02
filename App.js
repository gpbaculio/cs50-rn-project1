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

import { secondsToHms, minutesToSeconds } from './utils';

const DEFAULTS = {
  work: {
    minutes: '00',
    seconds: '05'
  },
  break: {
    minutes: '00',
    seconds: '05'
  },
  session: 'Work'
};

export default class App extends React.Component {
  state = {
    percent: new Animated.Value(0),
    timeRemaining: 0, // seconds
    start: false,
    time: '00:00:00',
    session: 'Work',
    workMins: '00',
    workSecs: '00',
    breakMins: '00',
    breakSecs: '00',
    startTimer: 0,
    pause: false,
    totalSeconds: 0
  };
  componentDidMount() {
    const { minutes: workMins, seconds: workSecs } = DEFAULTS.work;
    const { minutes: breakMins, seconds: breakSecs } = DEFAULTS.break;
    const totalSeconds =
      DEFAULTS.session === 'Work'
        ? minutesToSeconds(workMins) + parseInt(workSecs)
        : minutesToSeconds(breakMins) + parseInt(breakSecs);
    this.setState({
      workMins: workMins,
      workSecs: workSecs,
      breakMins: breakMins,
      breakSecs: breakSecs,
      session: DEFAULTS.session,
      time: secondsToHms(totalSeconds),
      totalSeconds
    });
  }
  startAnimation = () => {
    this.animation = Animated.timing(this.state.percent, {
      toValue: width / 2,
      duration: this.state.totalSeconds * 1000
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
        const time = secondsToHms(this.state.totalSeconds - 1);
        this.setState({
          startTimer,
          pause: false,
          time,
          totalSeconds: this.state.totalSeconds - 1
        });
        if (this.state.totalSeconds === 0) {
          clearInterval(this.state.startTimer);
          const newTotalSeconds =
            this.state.session === 'Work'
              ? minutesToSeconds(this.state.breakMins) +
                parseInt(this.state.breakSecs)
              : minutesToSeconds(this.state.workMins) +
                parseInt(this.state.workSecs);
          this.setState(
            {
              session: this.state.session === 'Work' ? 'Break' : 'Work',
              start: false,
              percent: new Animated.Value(0),
              time: secondsToHms(newTotalSeconds),
              totalSeconds: newTotalSeconds
            },
            this.onPlay
          );
        }
      }, 1000);
    }
  };
  onPlay = () => {
    this.setState(({ start, seconds }) => {
      if (start && seconds !== 0) {
        return { pause: true, start: false };
      }
      return { start: true };
    }, this.startAnimation);
  };
  onReset = () => {
    console.log('reset');
  };
  handleTimeInput = (key, val) => {
    this.setState({ [key]: val });
  };
  render() {
    const height = this.state.percent;
    const fillAnim = {
      height
    };
    const {
      start,
      timeRemaining,
      workMins,
      breakMins,
      workSecs,
      breakSecs,
      session,
      time
    } = this.state;
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
              onPress={this.onPlay}
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
                value={workMins}
              />
            </View>
            <View style={styles.secsContainer}>
              <Text style={styles.pause}>Secs:</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.secsInput}
                onChangeText={secs => this.handleTimeInput('workSeconds', secs)}
                value={workSecs}
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
                value={breakMins}
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
                value={breakSecs}
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
