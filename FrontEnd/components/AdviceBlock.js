// AdviceBlock.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import ButtonEdit from "./button";
import AddAdviceForm from "./AddAdviceForm"; // Adjust the path as needed
import { IP_Backend } from "./const";

const IP = IP_Backend;

const AdviceBlock = ({ plant, userId, fetchAdDetails }) => {
  const [showAllAdvice, setShowAllAdvice] = useState(false);

  const handleEdit = (adviceId) => {
    // Logique pour éditer le conseil
    console.log(`Edit advice with ID: ${adviceId}`);
    // Implémentez la logique de modification ici
  };

  const handleDelete = async (adviceId) => {
    try {
      const response = await fetch(`${IP}/advice/${adviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Actualiser les conseils après suppression
        fetchAdDetails();
      } else {
        Alert.alert("Erreur", "Impossible de supprimer le conseil.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du conseil :", error);
      Alert.alert("Erreur", "Une erreur est survenue.");
    }
  };

  const formatName = (firstName, lastName) => {
    if (!firstName || !lastName) {
      return "Utilisateur inconnu";
    }
    return `${firstName} ${lastName.charAt(0)}.`;
  };

  return (
    <View style={styles.adviceContainer}>
      <Text style={styles.adviceTitle}>Conseils :</Text>
      {plant.advice.slice(0, showAllAdvice ? plant.advice.length : 3).map((advice) => (
        <View key={advice.id} style={styles.adviceCard}>
          <Text style={styles.adviceContent}>{advice.content}</Text>
          <Text style={styles.adviceAuthor}>Posté par : {formatName(advice.first_name, advice.last_name)}</Text>
          <Text style={styles.adviceDate}>Le {new Date(advice.creation_date).toLocaleDateString()}</Text>
          {advice.id_user === userId && ( // Afficher les boutons si l'utilisateur connecté est celui qui a posté le conseil
            <View style={styles.buttonContainer}>
              <ButtonEdit
                theme="just-icon"
                icon="edit"
                color="#4d4d4d"
                size={20}
                onPress={() => handleEdit(advice.id)}
              />
              <ButtonEdit
                theme="just-icon"
                icon="close"
                color="#db402c"
                size={20}
                onPress={() => handleDelete(advice.id)}
              />
            </View>
          )}
        </View>
      ))}
      {plant.advice.length > 3 && !showAllAdvice && (
        <Button title="Voir plus de conseils" onPress={() => setShowAllAdvice(true)} />
      )}
      <AddAdviceForm plantId={plant.id} onAddAdvice={fetchAdDetails} />
    </View>
  );
};

const styles = StyleSheet.create({
  adviceContainer: {
    marginTop: 10,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  adviceCard: {
    marginTop: 5,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  adviceContent: {
    fontSize: 16,
    marginBottom: 10,
  },
  adviceAuthor: {
    fontSize: 14,
    color: "#767676",
  },
  adviceDate: {
    fontSize: 14,
    color: "#767676",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
});

export default AdviceBlock;
