import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Button, Keyboard, StyleSheet, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import {API_TOKEN} from '@env';

export default function App() {

  const [address, setAddress] = useState(''); // State where address is saved
  const [location, setLocation] = useState(null); // State where location is saved

  // Asking a permission to use the location
  useEffect(() => {
    (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to get location')
      return;
    }

    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setLocation(location);
    console.log('Location:', location)


  })(); }, []);



  // setting up initial map view (Haaga-Helia campus)
  const initial = {
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  };

  
// fetching the given address
const getAddress = async (address) => {
  const KEY = {
    headers: {
      apikey: API_TOKEN
    }
  }
  const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${KEY}&location=${address}`;

  try {
    const response = await fetch(url, KEY);
    const data = await response.json();
    console.log(data);

    const {lat, lng } = data.results[0].locations[0].latLng;
    console.log(lat, lng);
    setLocation({ ...location, latitude: lat, longitude: lng })
  } catch (error) {
    console.error('Api call failed', error.message);
  }
  Keyboard.dismiss();
};


  // TextInput lisätty ruudun alkuun, sillä iPhonella ei muuten näy
  // input kenttä tai nappi
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={text => setAddress(text)}
        value={address}
        placeholder={'Address'}
      />
      <View style={styles.button}>
      <Button onPress={() => getAddress(address)} title='SHOW'></Button>
      </View>
      <MapView
        style={styles.map}
        initialRegion={initial}
      >
        <Marker coordinate={location}/>
      </MapView>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  input: {
    marginBottom: 5,
    padding: 8,
    width: "100%",
    borderColor: "#AED6F1",
    borderWidth: 1,
    marginTop: 50,
  },
  // iPhone button does not have bacground color
  button: {
    backgroundColor: "#AED6F1",
    width: "100%",
  },
});
