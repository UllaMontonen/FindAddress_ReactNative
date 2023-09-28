import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Button, Keyboard, StyleSheet, TextInput, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {

  // setting up initial map view (Haaga-Helia campus)
  const initial = {
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  };

  const [region, setRegion] = useState(initial); // State where location is saved
  const [address, setAddress] = useState(''); // State where address is saved

  // Asking a permission to use the location
  useEffect(() => {
    const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to get location');
    } else {
      try {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setRegion({ ...region, latitude: location.coords.latitude, longitude: location.coords.longitude});
        console.log('Location:', location)
      } catch (error) {
        console.log.apply(error.message);
      }
    }
  } 
  fetchLocation(); 
}, []);

  
// fetching the given address
const fetchCoordinates = (address) => {
  const KEY = process.env.EXPO_PUBLIC_API_TOKEN; 
  const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${KEY}&location=${address}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const {lat, lng} = data.results[0].locations[0].latLng;
      setRegion({ ...region, latitude: lat, longitude: lng })
    })
    .catch(error => console.error('error', error.message));
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
      <Button onPress={() => fetchCoordinates(address)} title='SHOW'></Button>
      </View>
      <MapView
        style={styles.map}
        region={region}
      >
        <Marker coordinate={region}/>
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
