import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_Backend } from "./const";

const IP = IP_Backend;

const AddAdviceForm = ({ plantId, onAddAdvice }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userDataJson = await AsyncStorage.getItem('userData');
        if (userDataJson !== null) {
          const userData = JSON.parse(userDataJson);
          const userId = userData.data?.id;
          if (userId) {
            setUserId(userId);
          } else {
            console.error("User ID not found in userData");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleSubmit = async () => {
    if (!content) {
      Alert.alert("Erreur", "Veuillez écrire un conseil.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${IP}/advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          user_id: userId, // Utilisez l'ID de l'utilisateur récupéré
          plant_id: plantId,
        }),
      });

      if (response.ok) {
        const newAdvice = await response.json();
        onAddAdvice(newAdvice.data);
        setContent('');
      } else {
        Alert.alert("Erreur", "Impossible d'ajouter le conseil.");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du conseil :", error);
      Alert.alert("Erreur", "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Donnez un conseil :</Text>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        placeholder="Écrire un conseil"
      />
      <Button title="Ajouter le conseil" onPress={handleSubmit} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default AddAdviceForm;
