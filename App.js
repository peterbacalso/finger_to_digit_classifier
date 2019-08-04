import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import IconF from 'react-native-vector-icons/Feather';
import Tflite from 'tflite-react-native';
import RNFS from 'react-native-fs';

import Camera from './src/Camera';

let tflite = new Tflite();

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cameraOpen: false,
      label: null,
      confidence: null
    };
    this.evaluateImage = this.evaluateImage.bind(this);
  }

  componentWillMount() {
    tflite.loadModel({
      model: 'models/hand_to_digit.tflite',
      labels: 'models/hand_to_digit.txt',
      numThreads: 1, 
    },
    (err, res) => {
      if(err)
        console.warn(err);
      else
        console.warn(res);
    });
  }

  evaluateImage(uri) { 

    tflite.runModelOnImage({
      path: uri,
      imageMean: 127.5,
      imageStd: 127.5,
      numResults: 1,
      threshold: 0.05
    },
    (err, res) => {
      if(err) {
        console.warn(err);
        Alert.alert('Error: Unable to evaluating image')
      }
      else {
        const { label, confidence } = res[0]
        this.setState({ 
          label: label.toUpperCase(), 
          confidence: parseFloat(confidence).toFixed(2)*100
        })
      }
    });
  }

  render() {
    const { cameraOpen, label, confidence } = this.state

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hand To Digit Classifier</Text>
        </View>
        <View style={styles.optionsContainer}>
          <View style={styles.options}>
            <TouchableOpacity 
              onPress={() => this.setState({ cameraOpen: !cameraOpen })}>
              <IconF 
                name={cameraOpen ? 'camera-off' : 'camera'}
                style={styles.optionsIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.outputContainer}>
          { label ? <Text style={styles.output}>Label: {label}</Text> : null }
          { confidence ? <Text style={styles.output}>Confidence: {confidence} %</Text> : null }
          { label ? null : <Text style={styles.instructions}>Snap a picture of your hand to convert it to a digit</Text> }
        </View>
        <View style={styles.camera}>
          { cameraOpen ? <Camera setURI={this.evaluateImage} /> : null }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    flex: 1.2,
    backgroundColor: "#0F80FF",
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24
  },
  optionsContainer: {
    flex: .8,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "#666666"
  },
  options: {
    alignSelf: 'flex-end',
    marginRight: 30
  },
  optionsIcon: {
    fontSize: 30
  },
  outputContainer: {
    flex: 4,
    alignItems: 'center'
  },
  output: {
    color: 'black',
    fontSize: 40
  },
  instructions: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 45
  },
  camera: {
    flex: 5
  }
});
