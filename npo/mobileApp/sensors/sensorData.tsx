import { Accelerometer, Gyroscope, Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';

export class SensorDataService {
  static async startSensors(callback: (data: any) => void) {
    // Poskrbite, da je dovoljenje za lokacijo omogočeno
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    Accelerometer.setUpdateInterval(1000);
    Gyroscope.setUpdateInterval(1000);

    Accelerometer.addListener(accelerometerData => {
      callback({ type: 'accelerometer', data: accelerometerData });
    });

    Gyroscope.addListener(gyroscopeData => {
      callback({ type: 'gyroscope', data: gyroscopeData });
    });

    Pedometer.isAvailableAsync().then(result => {
      if (result) {
        Pedometer.watchStepCount(callback);
      }
    });

    Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 1000 }, locationData => {
      callback({ type: 'location', data: locationData });
    });
  }

  static stopSensors() {
    Accelerometer.removeAllListeners();
    Gyroscope.removeAllListeners();
    // Pedometer nima metode za odstranjevanje poslušalcev, zato preprosto prenehamo spremljati korake
    // Location.stopGeofencingAsync() ne obstaja, namesto tega prenehamo spremljanje pozicije
    Location.hasServicesEnabledAsync().then(enabled => {
      if (enabled) {
        Location.stopWatchAsync();
      }
    });
  }
}