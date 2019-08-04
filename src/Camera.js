'use strict';
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

export default class Camera extends Component {

  takePicture = async function() {
    if (this.camera) {
      const options = { width: 299, height: 299, quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.warn(data)
      await this.props.setURI(data.uri);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
        />
        <View style={styles.captureContainer}>
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ color:"white", fontSize:30 }}>SNAP</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  captureContainer: { 
    flex: 0, 
    flexDirection: 'row', 
    justifyContent: 'center' 
  },
  capture: {
    flex: 0,
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});