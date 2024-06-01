import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet } from "react-native";
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
          const parsedUserData = JSON.parse(jsonValue);
          const userId = parsedUserData.data.id;
          setUserId(userId);

          // Fetch user details by ID
          const userResponse = await fetch(`${IP}/user/${userId}`);
          if (!userResponse.ok) {
            throw new Error("Failed to fetch user details");
          }
          const userData = await userResponse.json();
          setUserData(userData.data.attributes);

          const fetchUserAds = async () => {
            try {
              const response = await fetch(`${IP_Back}/advertisement/user/${userId}`);
              if (!response.ok) {
                throw new Error("Failed to fetch user advertisements");
              }
              const userAds = await response.json();
              setUserAds(userAds.data);
            } catch (error) {
              console.error("Error fetching user advertisements:", error);
            }
          };

          fetchUserAds();
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur : ", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleSave = async () => {
    try {
      const userForm = {
        "first_name": userData.first_name,
        "last_name": userData.last_name,
        "email": userData.email
      };

      const response = await fetch(`${IP}/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userForm),
      });
      if (!response.ok) {
        throw new Error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("userToken");
      onLogout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const onDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const onDeleteAd = (advertisementId) => {
    setDeleteAdModalVisible(true);
    setDeletingAdId(advertisementId);
  };

  const cancelDeleteAccount = () => {
    setDeleteModalVisible(false);
  };

  const onCancelDeleteAd = () => {
    setDeleteAdModalVisible(false);
    setDeletingAdId(null);
  };

  const confirmDeleteAccount = async () => {
    try {
      const response = await fetch(`${IP}/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user account");
      }

      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("userToken");

      onLogout();
    } catch (error) {
      console.error("Error deleting user account:", error);
    }
  };

  const confirmDeleteAd = async () => {
    try {
      const plantsResponse = await fetch(`${IP_Back}/plant/advertisement/${deletingAdId}`);
      if (!plantsResponse.ok) {
        throw new Error("Failed to fetch plants associated with advertisement");
      }
      const plantsData = await plantsResponse.json();

      for (const plant of plantsData.data) {
        const imagesResponse = await fetch(`${IP_Back}/image/plant/${plant.plantid}`);
        if (!imagesResponse.ok) {
          throw new Error(`Failed to fetch images for plant ${plant.plantid}`);
        }
        const imagesData = await imagesResponse.json();

        for (const image of imagesData.data) {
          const deleteImageResponse = await fetch(`${IP_Back}/image/${image.imageid}`, {
            method: "DELETE",
          });
          if (!deleteImageResponse.ok) {
            throw new Error(`Failed to delete image ${image.imageid}`);
          }
        }

        const deletePlantResponse = await fetch(`${IP_Back}/plant/${plant.plantid}`, {
          method: "DELETE",
        });
        if (!deletePlantResponse.ok) {
          throw new Error(`Failed to delete plant ${plant.plantid}`);
        }
      }

      const response = await fetch(`${IP_Back}/advertisement/${deletingAdId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete advertisement");
      }

      const updatedUserAds = userAds.filter(ad => ad.id !== deletingAdId);
      setUserAds(updatedUserAds);
    } catch (error) {
      console.error("Error deleting advertisement:", error);
    } finally {
      setDeleteAdModalVisible(false);
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
                      <Text style={styles.adTitle}>{ad.attributes.title}</Text>
                      <Text>Du {new Date(ad.attributes.start_date).toLocaleDateString()} au {new Date(ad.attributes.end_date).toLocaleDateString()}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 15 }}>
                      <ButtonEdit
                        theme="just-icon"
                        icon="edit"
                        color="#4d4d4d"
                        size={20} // Change to number
                      />
                      <ButtonEdit
                        theme="just-icon"
                        icon="close"
                        color="#db402c"
                        size={20} // Change to number
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
  adDate: {
    fontStyle: 'italic',
  },
});

export default ProfileScreen;
