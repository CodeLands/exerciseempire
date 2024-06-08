import React, { useEffect } from 'react'
import { Redirect, router } from 'expo-router'
import * as SecureStore from 'expo-secure-store';
import * as Application from 'expo-application';

const api = process.env.EXPO_PUBLIC_API_URL

export default function StartScreen() {
  
  async function getValueFor(key: string) {
    let result = await SecureStore.getItemAsync(key);
    if (result)
      console.log(`🔐 Your key: ${key} has value: ${result} 🔐 \n`);
    else 
      console.log(`Your key: ${key} is not set. \n`);
    return result;
  }

  const checkIfAuthenticated = async () => {
    console.log('Checking if authenticated');
    try {
      const authToken = await getValueFor('authToken');
      const authTokenSavedAt = await getValueFor('authTokenSavedAt');

      const now = Date.now();

      // When fully authenticated, authToken will be set
      if (authToken !== null && authTokenSavedAt !== null) {
        console.log('Auth Token found:', authToken);
        console.log('Checking if auth token is still valid');

        const authTokenDiff = now - parseInt(authTokenSavedAt);
        console.log('AuthToken Difference:', authTokenDiff);
        if (authTokenDiff < 1000 * 60 * 60 * 24) { // Redirect to home if token is still valid and break out of function
          console.log('Auth token still valid, redirecting to home');
          router.replace('/home');
          return
        } else { // Delete authToken if expired
          console.log('Auth token expired, deleting it');
          await SecureStore.deleteItemAsync('authToken');
          await SecureStore.deleteItemAsync('authTokenSavedAt');
        }
      }

      const tempToken = await getValueFor('tempToken')
      const tempTokenSavedAt = await getValueFor('tempTokenSavedAt');

      // If not even partially authenticated, redirect to login and break out of function
      if (tempToken === null || tempTokenSavedAt === null) {
        console.log('Temp token not found, redirecting to login');
        await SecureStore.deleteItemAsync('tempToken');
        await SecureStore.deleteItemAsync('tempTokenSavedAt');
        router.replace('/login');
        return
      }

      console.log('Temp Token found:', tempToken);
      console.log('Checking if temp token is still valid');
      const tempTokenDiff = now - parseInt(tempTokenSavedAt);
      console.log('TempToken Difference:', tempTokenDiff);

      // If temp token is expired, delete it, redirect to login and break out of function
      if (tempTokenDiff > 1000 * 60 * 10) {
        console.log('Temp token expired, deleting it');
        await SecureStore.deleteItemAsync('tempToken');
        await SecureStore.deleteItemAsync('tempTokenSavedAt');
        router.replace('/login');
        return
      }

      console.log('Temp token still valid, checking if faceId is set up');
      const route = api + "/face-is-enabled/";
      // Check if faceId is set up
      const result = await fetch(route, {
        method: 'POST',
        headers: {
/*             'Content-Type': 'application/json',
 */            'Authorization': `Bearer ${tempToken}`,
        },
      })
      const data = await result.json()
      console.log("Has-face-setup response data:", data)
      if (!data.success) { // If there is an error, redirect to login TODO: Add error message
        console.error('Error checking if faceId is set up:', data.errors);
        router.replace('/login');
      }

      if (data.data.has2fa) { // If faceId is set up, redirect to faceIdLogin
        console.log('FaceId is set up, redirecting to faceIdLogin');
        router.replace('/faceIdLogin');
        SecureStore.deleteItemAsync('tempToken');
        SecureStore.deleteItemAsync('tempTokenSavedAt');
        SecureStore.deleteItemAsync('authToken');
        SecureStore.deleteItemAsync('authTokenSavedAt');
      } else { // If faceId is not set up, redirect to faceIdRegister
        console.log('FaceId is not set up, redirecting to faceIdRegister');
        router.replace('/faceIdRegister');
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