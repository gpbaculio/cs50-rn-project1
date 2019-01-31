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
    timeRemaining: 5 * 1000, // seconds
    workDuration: '25:00',
    breakDuration: '05:00',
    start: false,
    time: '00:00:00',
    session: 'Work',
    workMinsInput: '25',
    breakMinsInput: '05',
    workSecsInput: '5',
    breakSecsInput: '5'
  };
  startAnimation = () => {
    if (!this.state.start) {
      this.setState({ percent: new Animated.Value(0) });
    }
    this.animation = Animated.timing(this.state.percent, {
      toValue: width / 2,
      duration: this.state.timeRemaining
    });
    this.animation.start();
  };
  playTimer = ms => {
    this.setState({ start: !this.state.start }, this.startAnimation);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    const startTimer = setInterval(() => {
      seconds = seconds - 1;
      const time = secondsToHms(seconds);
      this.setState({
        pause: false,
        seconds,
        time
      });
      if (seconds === 0) {
        clearInterval(startTimer);
        // const session = this.state.session === 'Work' ? 'Work' : 'Break';
        // this.setState({ session }, () => {
        //   const { session, workDuration, breakDuration } = this.state;
        //   const duration = session === 'Work' ? workDuration : breakDuration;
        //   this.playTimer(duration);
        // });
      }
    }, 1000);
  };
  onPause = () => {
    console.log('paused');
  };
  onReset = () => {
    console.log('reset');
  };
  handleMinsInput = (mins, type) => {
    console.log('mins input');
  };
  handleSecsInput = () => {
    console.log('mins input');
  };
  render() {
    const fillAnim = {
      height: this.state.percent
    };
    const {
      start,
      timeRemaining,
      workMinsInput,
      breakMinsInput,
      workSecsInput,
      breakSecsInput,
      session,
      minsInput,
      secsInput,
      time
    } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.progressContainer}
          onPress={() => this.playTimer(timeRemaining)}>
          <Text style={styles.timer}>{time}</Text>
          {start && <Animated.View style={[styles.progress, fillAnim]} />}
          <Text>{`${session} Time`}</Text>
        </TouchableOpacity>
        <View style={styles.controlsContainer}>
          <View style={styles.controls}>
            <Button
              onPress={this.onPause}
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
                onChangeText={mins => this.handleMinsInput(mins, 'work')}
                value={workMinsInput}
              />
            </View>
            <View style={styles.secsContainer}>
              <Text style={styles.pause}>Secs:</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.secsInput}
                onChangeText={secs => this.handleMinsInput(secs, 'work')}
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
                onChangeText={mins => this.handleMinsInput(mins, 'break')}
                value={breakMinsInput}
              />
            </View>
            <View style={styles.secsContainer}>
              <Text style={styles.pause}>Secs:</Text>
              <TextInput
                keyboardType="numeric"
                style={styles.secsInput}
                onChangeText={secs => this.handleMinsInput(secs, 'break')}
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
