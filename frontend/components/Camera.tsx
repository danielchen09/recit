import React, {useState, useEffect} from 'react';
import { Camera } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, ImageBackground, Alert, View } from 'react-native';
import { Layout, Button, Spinner, Icon } from '@ui-kitten/components';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
const CameraComp = ({navigation, route}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isCapture, setIsCapture] = useState(false);
  const [picUri, setPicUri] = useState('');
  const [receiptId, setReceiptId] = useState('');
  const [loading, setLoading] = useState(false);
  let camera: Camera | null;

  const takePicture = () => {
    if (camera) {
        camera.takePictureAsync({ onPictureSaved: onPictureSaved });
    }
  };

  function makeRequest (method, url, file, done) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      done(null, xhr.response);
    };
    xhr.onerror = function () {
      done(xhr.response);
    };
    xhr.send(file);
  }

  const onPictureSaved = photo => {
      setPicUri(photo.uri);
      setIsCapture(true);
      
      var photoBlob = {
        uri: photo.uri,
        type: 'image/jpeg',
        name: Date.now() + '.jpg',
      };
      
      var body = new FormData();
      body.append('file', photoBlob);
      body.append('owner', route.params.username ?? '');

      setLoading(true);
      makeRequest('POST', "http://104.198.190.25:5000/ocr", body, function (err, datums) {
        if (err) { 
          Alert.alert("Error")
          throw err; 
        }
        setReceiptId(JSON.parse(datums).id);
        setLoading(false);
      });
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <Layout />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const LoadingIndicator = (props) => (
    <View style={[props.style, styles.indicator]}>
      <Spinner size='small' style={{
        backgroundColor: '#fff',
        borderColor: '#fff',
      }}/>
    </View>
  );

  return (
    <Layout style={styles.container}>
      {
        !isCapture ? (
          <Camera style={styles.camera} type={type} ref={(ref) => { camera = ref }} >
          <Layout style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            </TouchableOpacity>
          </Layout>
        </Camera>
        ) : (
          <Layout style={styles.container}>
            <ImageBackground
              style={styles.pic}
              source={{
                uri: picUri
              }}
            >
              <Layout style={styles.buttonContainer}>
                <Button
                  disabled={loading}
                  onPress={() => {
                    setIsCapture(false)
                    navigation.navigate('Dashboard', {
                      receiptId: receiptId,
                      username: route.params.username
                    })
                  }} 
                  style={styles.okButton} 
                  accessoryLeft={loading ? <LoadingIndicator/> : <Icon name="checkmark" />}
                />
              </Layout>
            </ ImageBackground>
          </Layout>
        )
      }
    </Layout>
  );
};

export default CameraComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  okButton: {
    backgroundColor: "#3473AA",
    borderColor: '#3473AA',
    width: 60,
    height: 60,
    marginTop: '175%',
    borderRadius: 100,
    alignSelf: 'center',
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  okIcon: {
    backgroundColor: "#fff",
  },
  flipButton: {
    width: 200,
    height: 30,
  },
  confirmButton: {
    backgroundColor: "#fff",
    borderColor: '#fff',
    borderRadius: 100,
    width: 100,
    height: 30,
    marginRight: 20
  },
  captureButton: {
    height: 60,
    width: 60,
    borderRadius: 100,
    backgroundColor: "#fff",
    alignSelf: 'center',
    marginTop: '175%',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  pic: {
    width: '100%',
    height: '100%',
  },
});
