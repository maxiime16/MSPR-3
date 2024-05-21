import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, Button, StyleSheet } from "react-native";
import { IP_Auth, IP_Backend } from "../../components/const";
import ButtonEdit from "../../components/button";
import ConfirmationModal from "../../components/confirmationModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ onLogout }) => {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleteAdModalVisible, setDeleteAdModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userAds, setUserAds] = useState([]);
  const [deletingAdId, setDeletingAdId] = useState(null);
  const IP = IP_Auth;
  const IP_Back = IP_Backend;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("userData");
        if (jsonValue !== null) {

          const userData = JSON.parse(jsonValue).data.attributes;
          const userId = JSON.parse(jsonValue).data.id;
          setUserData(userData);
          setUserId(userId);
          console.log("jsonValue", jsonValue)
          console.log("userData", userData)

          // Appeler la méthode pour récupérer les annonces de l'utilisateur
          const fetchUserAds = async () => {
            try {
              console.log(userData.id);
              const response = await fetch(
                `${IP_Back}/advertisements/user/${userData.id}`
              );
              if (!response.ok) {
                throw new Error("Failed to fetch user advertisements");
              }
              const userAds = await response.json();
              setUserAds(userAds);
              console.log(userAds);
            } catch (error) {
              console.error("Error fetching user advertisements:", error);
            }
          };

          fetchUserAds();
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur : ",
          error
        );
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
    console.log("userdata modifié", userData);
  };

  const handleSave = async () => {
    try {

      console.log(userId);
      console.log("firstname", userData.first_name);
      console.log("last_name", userData.last_name);
      console.log("email", userData.email);
      const userForm = {
        "first_name": userData.first_name,
        "last_name": userData.last_name,
        "email": userData.email
      };

      // Faire la requête PUT à l'API pour mettre à jour les informations de l'utilisateur
      const response = await fetch(`${IP}/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userForm),
      });

      console.log("userdata envoie", userData);

      if (!response.ok) {
        throw new Error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  // Fonction pour se déconnecter
  const handleLogout = async () => {
    try {
      // Supprimer les données utilisateur du AsyncStorage
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("userToken");
      onLogout(); // Appeler la fonction de rappel pour déconnecter l'utilisateur
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Fonction pour ouvrir le modal de confirmation
  const onDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const onDeleteAd = (advertisementId) => {
    setDeleteAdModalVisible(true);
    setDeletingAdId(advertisementId); // Enregistrer l'ID de l'annonce à supprimer
  };

  // Fonction pour annuler la suppression du compte
  const cancelDeleteAccount = () => {
    setDeleteModalVisible(false);
  };

  const onCancelDeleteAd = () => {
    setDeleteAdModalVisible(false);
    setDeletingAdId(null); // Réinitialiser l'ID de l'annonce à supprimer
  };

  const confirmDeleteAccount = async () => {
    try {
      // Faire la requête DELETE à l'API pour supprimer le compte utilisateur
      const response = await fetch(`${IP}/users/${userData.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user account");
      }

      // Supprimer les données utilisateur du AsyncStorage
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("userToken");

      onLogout();
    } catch (error) {
      console.error("Error deleting user account:", error);
    }
  };

  
  const confirmDeleteAd = async () => {
    console.log(deletingAdId)
    try {
      const response = await fetch(`${IP_Back}/advertisements/${deletingAdId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete advertisement");
      }
  
      // Actualiser la liste des annonces de l'utilisateur après la suppression
      const updatedUserAds = userAds.filter(ad => ad.id !== deletingAdId);
      setUserAds(updatedUserAds);
    } catch (error) {
      console.error("Error deleting advertisement:", error);
    } finally {
      setDeleteAdModalVisible(false); // Cacher le modal de confirmation après la suppression
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {userData ? (
          <>
            <View style={styles.infoContainer}>
              <Text style={styles.label}>Mes annonces:</Text>
              <View style={styles.hr}></View>
              {userAds.length > 0 ? (
                userAds.map((ad) => (
                  <View key={ad.id} style={styles.adContainer}>
                    <View style={styles.adTextContainer}>
                      <Text style={styles.adTitle}>{ad.title}</Text>
                      <Text>{ad.description}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 15, }}>
                      <ButtonEdit
                        theme="just-icon"
                        icon="edit"
                        color="#4d4d4d"
                        size="20"
                      />
                      <ButtonEdit
                        theme="just-icon"
                        icon="close"
                        color="#db402c"
                        size="20"
                        onPress={() => onDeleteAd(ad.id)}
                      />
                    </View>
                  </View>
                ))
              ) : (
                <Text>Vous n'avez pas encore d'annonce...</Text>
              )}
            </View>


            <View style={styles.infoContainer}>
              <Text style={styles.label}>Mes informations:</Text>
              <View style={styles.hr}></View>
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.label}>Prénom:</Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={userData.first_name}
                onChangeText={(text) => handleChange("first_name", text)}
              />
              <Text style={styles.label}>Nom:</Text>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={userData.last_name}
                onChangeText={(text) => handleChange("last_name", text)}
              />
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={userData.email}
                onChangeText={(text) => handleChange("email", text)}
              />
            </View>
            <View style={styles.sendButtonContainer}>
              <ButtonEdit
                style={styles.button}
                theme="primary-full"
                label="Sauvegarder"
                onPress={handleSave}
              />
            </View>
            <View style={styles.sendButtonContainer}>
              <ButtonEdit
                style={styles.button}
                theme="primary-full"
                label="Me déconnecter"
                onPress={handleLogout}
              />
            </View>

            <View style={styles.sendButtonContainer}>
              <ButtonEdit label="Supprimer le compte" onPress={onDeleteAccount} />
            </View>
            {/* Modal de confirmation pour la suppression du compte */}
            <ConfirmationModal
              visible={isDeleteModalVisible}
              onClose={cancelDeleteAccount}
              onConfirm={confirmDeleteAccount}
              message="Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
            />

            <ConfirmationModal
              visible={isDeleteAdModalVisible}
              onClose={onCancelDeleteAd}
              onConfirm={confirmDeleteAd}
              message="Êtes-vous sûr de vouloir supprimer votre annonce ?."
            />
          </>
        ) : (
          <View style={styles.sendButtonContainer}>
            <Text>Chargement des données...</Text>
            <ButtonEdit
              style={styles.button}
              theme="primary-full"
              label="Me déconnecter"
              onPress={handleLogout}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  sendButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  infoContainer: {
    width: "100%",
    marginBottom: 20,
    marginTop: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 15,
  },
  hr: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    marginBottom: 25,
  },
  adContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  adTextContainer: {
    flex: 1,
  },
  adTitle: {
    fontWeight: 'bold',
  },
});

export default ProfileScreen;