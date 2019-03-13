import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Button,
  TextInput
} from 'react-native';

import { secondsToHms, getSeconds, vibrate } from './utils';

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

const { width } = Dimensions.get('window');

export default class App extends React.Component {
  state = {
    percent: new Animated.Value(0),
    timeRemaining: 0, // seconds
    start: false,
    time: '00:00:00',
    session: 'Work',
    WorkMins: '00',
    WorkSecs: '00',
    BreakMins: '00',
    BreakSecs: '00',
    startTimer: 0,
    pause: false,
    totalSeconds: 0
  };
  componentDidMount() {
    const { minutes: WorkMins, seconds: WorkSecs } = DEFAULTS.work;
    const { minutes: BreakMins, seconds: BreakSecs } = DEFAULTS.break;
    const totalSeconds =
      DEFAULTS.session === 'Work'
        ? getSeconds(WorkMins, WorkSecs)
        : getSeconds(BreakMins, BreakSecs);
    this.setState({
      WorkMins,
      WorkSecs,
      BreakMins,
      BreakSecs,
      session: DEFAULTS.session,
      time: secondsToHms(totalSeconds),
      totalSeconds
    });
  }
  getTotalSeconds = session => {
    const {
      WorkMins,
      WorkSecs,
      BreakMins,
      BreakSecs
    } = this.state
    const totalSeconds = session === 'Work'
      ? getSeconds(
        WorkMins === '' ? '0' : WorkMins,
        WorkSecs === '' ? '0' : WorkSecs
      ) : getSeconds(
        BreakMins === '' ? '0' : BreakMins,
        BreakSecs === '' ? '0' : BreakSecs
      );
    return totalSeconds
  }
  startAnimation = () => {
    const { percent, totalSeconds, pause, start } = this.state
    this.animation = Animated.timing(percent, {
      toValue: width / 2,
      duration: totalSeconds * 1000
    });
    if (pause) {
      percent.stopAnimation(val => {
        percent.setValue(val);
      });
      clearInterval(this.state.startTimer);
    }
    if (start) {
      this.animation.start();
      const startTimer = setInterval(() => {
        const time = secondsToHms(this.state.totalSeconds - 1);
        this.setState({
          startTimer,
          pause: false,
          time,
          totalSeconds: this.state.totalSeconds > 1 ? this.state.totalSeconds - 1 : 0
        });
        if (this.state.totalSeconds === 0) {
          vibrate()
          clearInterval(this.state.startTimer);
          const session = this.state.session === 'Work' ? 'Break' : 'Work'
          const newTotalSeconds = this.getTotalSeconds(session)
          this.setState(
            {
              session,
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
    clearInterval(this.state.startTimer);
    const totalSeconds = this.getTotalSeconds(this.state.session)
    this.setState({
      totalSeconds,
      time: secondsToHms(totalSeconds),
      percent: new Animated.Value(0),
      start: false,
      pause: false
    });
  };
  handleTimeInput = (key, val, timeFor) => {
    this.setState({ [key]: val }, () => {
      if (this.state.session.includes(timeFor)) {
        const totalSeconds = this.getTotalSeconds(this.state.session)
        const time = secondsToHms(totalSeconds);
        clearInterval(this.state.startTimer);
        this.setState({
          totalSeconds,
          time,
          percent: new Animated.Value(0),
          start: false
        });
      }
    });
  };
  getPlayBtnTitle = () => {
    const { pause, start } = this.state
    if (pause) {
      return 'Resume';
    } else if (!start && !pause) {
      return 'Start';
    } else {
      return 'Pause';
    }
  };
  render() {
    const {
      WorkMins,
      WorkSecs,
      BreakMins,
      BreakSecs,
      session,
      time,
      percent
    } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.progressContainer}>
          <Text style={styles.time}>
            {time}
          </Text>
          <Animated.View style={[styles.progress, { height: percent }]} />
          <Text style={styles.time}>
            {`${session} Timer`}
          </Text>
        </View>
        <View style={styles.controlsContainer}>
          <View style={styles.controls}>
            <Button
              onPress={this.onPlay}
              title={this.getPlayBtnTitle()}
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
                onChangeText={mins => this.handleTimeInput('WorkMins', mins, 'Work')}
                value={WorkMins}
              />
            </View>
            <View style={styles.secsContainer}>
              <Text style={styles.pause}>Secs:</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.secsInput}
                onChangeText={secs => this.handleTimeInput('WorkSecs', secs, 'Work')}
                value={WorkSecs}
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
                onChangeText={mins => this.handleTimeInput('BreakMins', mins, 'Break')}
                value={BreakMins}
              />
            </View>
            <View style={styles.secsContainer}>
              <Text style={styles.pause}>Secs:</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.secsInput}
                onChangeText={secs => this.handleTimeInput('BreakSecs', secs, 'Break')}
                value={BreakSecs}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

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
  },
  timeContainer: {
    flexDirection: 'row',
    width: width * 0.8,
    justifyContent: 'space-around',
    marginTop: 20
  },
  controls: {
    flexDirection: 'row',
    width: width * 0.4,
    justifyContent: 'space-around'
  },
  progress: {
    backgroundColor: '#f9b8f9',
    width: '100%',
    bottom: 0,
    position: 'absolute',
    zIndex: 0
  },
  time: {
    zIndex: 1,
    color: '#841584'
  },
  progressContainer: {
    width: width / 2,
    height: width / 2,
    borderRadius: width / 2,
    borderWidth: 0.5,
    color: 'white',
    borderColor: '#841584',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  }
});
