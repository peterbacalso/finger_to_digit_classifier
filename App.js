import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import IconF from 'react-native-vector-icons/Feather';
import IconEI from 'react-native-vector-icons/EvilIcons';
import Tflite from 'tflite-react-native';
import ImageResizer from 'react-native-image-resizer';

import Camera from './src/Camera';

let tflite = new Tflite();
const IMG_SIZE = 229;

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      cameraOpen: false,
      label: null,
      confidence: null,
      isProcessing: false
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
        Alert.alert('Error: Unable to load inference model')
      // else
      //   console.warn(res);
    });
  }

  evaluateImage(uri) { 
    this.setState({ isProcessing: true })
    ImageResizer.createResizedImage(uri, IMG_SIZE, IMG_SIZE, 'JPEG', 100, 0).then((response) => {
      // response.uri is the URI of the new image that can now be displayed, uploaded...
      tflite.runModelOnImage({
        path: response.uri,
        imageMean: 127.5,
        imageStd: 127.5,
        numResults: 1,
        threshold: 0.05
      },
      (err, res) => {
        if(err) {
          Alert.alert('Error: Unable to evaluating image')
        }
        else {
          const { label, confidence } = res[0]
          this.setState({ 
            label: label.toUpperCase(), 
            confidence: parseInt(parseFloat(confidence)*100),
            isProcessing: false
          })
        }
      });
    }).catch((err) => {
      Alert.alert('Error: Unable to resize image')
    });
  }

  render() {
    const { cameraOpen, label, confidence, isProcessing } = this.state

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>HOW MANY FINGERS?</Text>
        </View>
        <View style={styles.optionsContainer}>
          {label 
          ? <View style={styles.clear}>
            <TouchableOpacity 
              style={{flexDirection:'row', marginLeft: 20}}
              onPress={() => this.setState({ label: null, confidence: null })}>
              <IconEI 
                name='close'
                style={styles.optionsIcon} />
              <Text style={{fontSize: 18}}>CLEAR</Text>
            </TouchableOpacity>
          </View> : null}
          <View style={styles.options}>
            <TouchableOpacity 
              style={{ marginRight: 20 }}
              onPress={() => this.setState({ cameraOpen: !cameraOpen })}>
              <IconF 
                name={cameraOpen ? 'camera-off' : 'camera'}
                style={styles.optionsIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.outputContainer}>
          { isProcessing ? <ActivityIndicator style={{marginTop: 30}} size="large"/> : null }
          { !isProcessing && label 
              ? <Text style={styles.output}>Label: {label}</Text> : null }
          { !isProcessing && confidence 
              ? <Text style={styles.output}>Confidence: {confidence} %</Text> : null }
          { isProcessing || label 
              ? null : <Text style={styles.instructions}>Open the camera and snap a picture of your hand to find out how many fingers are up</Text> }
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
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "#666666"
  },
  clear: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  options: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  optionsIcon: {
    fontSize: 30
  },
  outputContainer: {
    flex: 3,
    alignItems: 'center'
  },
  output: {
    color: 'black',
    fontSize: 40
  },
  instructions: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 30
  },
  camera: {
    flex: 6
  }
});
