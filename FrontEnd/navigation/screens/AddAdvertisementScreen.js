import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Button, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddPlant from '../../components/AddPlant';
import DatePicker from 'react-native-modern-datepicker';
import axios from 'axios';
import { IP_Backend } from "../../components/const";
const IP = IP_Backend;

export default function AddAdvertisementScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('Champs-Élysées, Paris, France');
  const [city, setCity] = useState('Paris');
  const [postalCode, setPostalCode] = useState('75008');
  const [coordinates, setCoordinates] = useState({ lat: 48.8566, lng: 2.3522 });
  const [plants, setPlants] = useState([]);
  const [showAddPlant, setShowAddPlant] = useState(false);
  const [userId, setUserId] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    console.log('===== Ajout Annonce ======');
    const fetchUserId = async () => {
      try {
        const userDataJson = await AsyncStorage.getItem("userData");
        if (userDataJson !== null) {
          const userData = JSON.parse(userDataJson);
          const userId = userData.data?.id;
          if (userId) {
            setUserId(userId);
            console.log('User ID fetched:', userId); // Log the user ID
          } else {
            console.error('User ID not found in userData');
          }
        }
      } catch (error) {
        console.error('Failed to fetch user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  const handlePlantAdd = (plantData) => {
    if (plants.length < 5) {
      setPlants([...plants, plantData]);
      setShowAddPlant(false);
    } else {
      console.log('Vous ne pouvez pas ajouter plus de 5 plantes.');
    }
  };

  const handleShowAddPlant = () => {
    if (plants.length < 5) {
      setShowAddPlant(true);
    } else {
      console.log('Vous ne pouvez pas ajouter plus de 5 plantes.');
    }
  };

  const handleRemovePlant = (index) => {
    const updatedPlants = plants.filter((_, i) => i !== index);
    setPlants(updatedPlants);
  };

  const handlePublish = async () => {
    if (!title || !address || !city || !postalCode || !coordinates || plants.length === 0 || !selectedStartDate || !selectedEndDate) {
      Alert.alert('Erreur', 'Tous les champs sont requis, y compris les dates, et il doit y avoir au moins une plante.');
      return;
    }

    console.log('Plantes à valider:', plants); // Log all plants for validation

    for (const plant of plants) {
      if (!plant.subCategoryValue) {
        Alert.alert('Erreur', 'Chaque plante doit avoir une sous-catégorie.');
        return;
      }
    }

    try {
      if (!coordinates) {
        throw new Error('Les coordonnées ne sont pas définies');
      }
      if (!userId) {
        throw new Error('User ID not found');
      }

      console.log('Using User ID:', userId); // Log the user ID before making requests

      // Step 1: Add the address to the database
      console.log('=== Step 1 ===');
      const addressResponse = await axios.post(`${IP}/address`, {
        city: city,
        postal_code: postalCode,
        longitude: coordinates.lng,
        latitude: coordinates.lat,
      });

      const addressId = addressResponse.data.data.id;
      console.log('Address added:', addressResponse.data);

      // Step 2: Add the advertisement with the address ID and user ID
      console.log('=== Step 2 ===');
      const advertisementResponse = await axios.post(`${IP}/advertisement`, {
        title,
        start_date: selectedStartDate,
        end_date: selectedEndDate,
        user_id: userId, // use the fetched user ID
        address_id: addressId,
      });

      const advertisementId = advertisementResponse.data.data.id;
      console.log('Advertisement added:', advertisementResponse.data);

      // Step 3: Add each plant with the advertisement ID
      console.log('=== Step 3 ===');
      for (const plant of plants) {
        console.log('Adding plant:', plant.plantName); // Log each plant before adding
        const plantResponse = await axios.post(`${IP}/plant`, {
          name_plant: plant.plantName,
          description: plant.description,
          advertisement_id: advertisementId,
          subcategory_id: plant.subCategoryValue, // ensure subCategoryValue is provided
        });

        const plantId = plantResponse.data.data.id;
        console.log('Plant added:', plantResponse.data);

        // Step 4: Add each image for the plant with the plant ID
        console.log('=== Step 4 ===');
        for (const image of plant.images) {
          
          const imageResponse = await axios.post(`${IP}/image`, {
            image: image.base64,
            plant_id: plantId
          });

          console.log('Image response:', imageResponse.data); // Log response

          if (!imageResponse.data.success) {
            throw new Error('Failed to add image');
          }
          console.log('Image added:', imageResponse.data);
        }
      }

      console.log('Annonce publiée avec succès');
      // You can navigate to another screen or show a success message here
    } catch (error) {
      console.error('Error publishing advertisement:', error.response ? error.response.data : error.message);
      // Show error message to the user
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          style={styles.input}
          placeholder="Titre de l'annonce"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.input}
          placeholder="Adresse"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Ville"
          value={city}
          onChangeText={setCity}
        />
        <TextInput
          style={styles.input}
          placeholder="Code Postal"
          value={postalCode}
          onChangeText={setPostalCode}
        />
        <View style={styles.datePicker}>
          <Text style={[styles.label, { paddingTop: 10 }]}>Date de début</Text>
          <DatePicker
            onSelectedChange={date => setSelectedStartDate(date)}
            mode="calendar"
            minimumDate={currentDate}
            options={{
              selectedTextColor: '#fff',
              mainColor: '#A3D288',
            }}
          />
          {selectedStartDate && (
            <View>
              <Text style={[styles.label, { paddingTop: 10 }]}>Date de fin</Text>
              <DatePicker
                onSelectedChange={date => setSelectedEndDate(date)}
                mode="calendar"
                minimumDate={selectedStartDate}
                current={selectedStartDate}
                options={{
                  selectedTextColor: '#fff',
                  mainColor: '#A3D288',
                }}
              />
            </View>
          )}
        </View>
        {plants.map((plant, index) => (
          <View key={index} style={styles.plantContainer}>
            <View style={styles.plantDetails}>
              <Text>Plante {index + 1}</Text>
              <Text>Nom: {plant.plantName}</Text>
              <Text>Description: {plant.description}</Text>
              <Text>Catégorie: {plant.categoryValue}</Text>
              <Text>Sous-catégorie: {plant.subCategoryValue}</Text>
              <Text>Images: {plant.images.length}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemovePlant(index)}>
              <Icon name="delete" size={30} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        {showAddPlant ? (
          <AddPlant onPlantAdd={handlePlantAdd} />
        ) : (
          <Button title="Ajouter une plante" onPress={handleShowAddPlant} />
        )}
        <Button title="Publier l'annonce" onPress={handlePublish} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  plantContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plantDetails: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    color: '#9b9b9b',
    paddingVertical: 5,
  },
  datePicker: {
    marginBottom: 20,
  },
});
