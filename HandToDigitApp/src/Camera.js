'use strict';
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import MovableView from 'react-native-movable-view'
import IconFA from 'react-native-vector-icons/FontAwesome';

export default class Camera extends Component {

  constructor(props) {
    super(props)
    this.state = {
      pressTimeStamp: null
    };
    this.takePicture = this.takePicture.bind(this);
  }

  takePicture = async function() {
    if (this.camera) {
      // const options = { width: 299, height: 299, quality: 0.5, base64: true };
      const options = { skipProcessing: true };
      const data = await this.camera.takePictureAsync(options);
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
        <View style={{position: 'absolute', left: 200, top: 200}}>
          <MovableView 
          onDragStart={() => {
            this.setState({ pressTimeStamp: new Date() })
          }} 
          onDragEnd={() => {
            let now = new Date()
            let duration = now - this.state.pressTimeStamp
            if (duration < 200) this.takePicture()
          }}>
              <IconFA name="camera" style={{ color:"white", fontSize:60 }}/>
          </MovableView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});