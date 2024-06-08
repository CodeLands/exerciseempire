import { Accelerometer, Gyroscope, Pedometer } from 'expo-sensors';
import * as Location from 'expo-location';

export class SensorDataService {
  static accelerometerData = [];
  static gyroscopeData = [];

  static async startSensors(callback: (data: any) => void) {
    // Poskrbite, da je dovoljenje za lokacijo omogočeno
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return;
    }

    Accelerometer.setUpdateInterval(1000);
    Gyroscope.setUpdateInterval(1000);

    Accelerometer.addListener(data => {
      this.accelerometerData.push(data);
      if (this.accelerometerData.length === 10) {
        const avgData = this.calculateAverage(this.accelerometerData);
        const normalizedData = this.normalizeData(avgData);
        callback({ type: 'accelerometer', data: normalizedData });
        this.accelerometerData = [];
      }
    });

    Gyroscope.addListener(data => {
      this.gyroscopeData.push(data);
      if (this.gyroscopeData.length === 10) {
        const avgData = this.calculateAverage(this.gyroscopeData);
        const normalizedData = this.normalizeData(avgData);
        callback({ type: 'gyroscope', data: normalizedData });
        this.gyroscopeData = [];
      }
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

  static calculateAverage(dataArray: any[]) {
    const sum = dataArray.reduce((acc: { x: any; y: any; z: any; }, data: { x: any; y: any; z: any; }) => ({
      x: acc.x + data.x,
      y: acc.y + data.y,
      z: acc.z + data.z
    }), { x: 0, y: 0, z: 0 });

    return {
      x: sum.x / dataArray.length,
      y: sum.y / dataArray.length,
      z: sum.z / dataArray.length
    };
  }

  static normalizeData(data) {
    const magnitude = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
    return magnitude; // Pošlje se samo normalizirana povprečna vrednost
  }
}