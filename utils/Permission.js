import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

export async function requestCameraPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs access to your camera',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
        // Do something with the camera
      } else {
        console.log('Camera permission denied');
        Alert.alert(
          'Permission Denied',
          'Please grant camera permission in order to take photos',
          [
            { text: 'Cancel', onPress: () => console.log('Permission denied'), style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
          { cancelable: false }
        );
      }
  }
}

export async function requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }




