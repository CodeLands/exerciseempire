import React, { useEffect } from 'react'
import { Redirect, router } from 'expo-router'
import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';

export default function StartScreen() {
  
  async function getValueFor(key: string) {
    let result = await SecureStore.getItemAsync(key);
    if (result)
      console.log(`🔐 Your key: ${key} has value: ${result} 🔐 \n`);
    else 
      console.error(`Your key: ${key} is not set. \n`);
    return result;
  }

  const checkIfAuthenticated = async () => {
    console.log('Checking if authenticated');
    try {
      const authToken = await getValueFor('authToken');
      // AsyncStorage.getItem('authToken');
      if (authToken !== null) {
        console.log('Auth Token found:', authToken);
        router.replace('/home');
      }
      const tempToken = await getValueFor('tempToken')
      // AsyncStorage.getItem('tempToken');
      if (tempToken !== null) {
        console.log('Temp Token found:', tempToken);
        router.replace('/faceIdLogin');
      }
    } catch (e) {
      console.error('Error reading token from async storage:', e);
    }
  };

  useEffect(() => {
    checkIfAuthenticated();
  }, [])

  return (
  <Redirect href="/home" />
)
}