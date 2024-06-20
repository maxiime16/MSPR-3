import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import MapView, { Circle } from "react-native-maps";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { IP_Backend } from "../../components/const";
import ButtonEdit from "../../components/button";
import AddAdviceForm from "../../components/AddAdviceForm"; // Adjust the path as needed

const IP = IP_Backend;
const windowDimensions = Dimensions.get("window");

const AdvertisementDetailScreen = () => {
  const route = useRoute();
  const { adId } = route.params;
  const navigation = useNavigation();
  const [adData, setAdData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [plantsData, setPlantsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState({});

  const fetchAdDetails = async () => {
    try {
      const response = await fetch(`${IP}/advertisement/details/${adId}`);
      const data = await response.json();
      setAdData(data.data);
      console.log("adData", adData)

      const plantsResponse = await fetch(`${IP}/plant/advertisement/${adId}`);
      const plantsData = await plantsResponse.json();

      const plantsWithImagesAndAdvice = await Promise.all(
        plantsData.data.map(async (plant) => {
          const imagesResponse = await fetch(`${IP}/image/plant/${plant.plantid}`);
          const imagesData = await imagesResponse.json();
          const adviceResponse = await fetch(`${IP}/advice/plant/${plant.plantid}`);
          const adviceData = await adviceResponse.json();
          return {
            ...plant,
            images: imagesData.data || [],
            advice: adviceData.data || [],
          };
        })
      );

      setPlantsData(plantsWithImagesAndAdvice);
      setLoading(false);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de l'annonce :",
        error
      );
    }
  };

  useEffect(() => {
    fetchAdDetails();
  }, [adId]);

  useEffect(() => {
    if (adData) {
      console.log("adData", adData);
      setUserId(adData.userid);
    }
    
  }, [adData]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleAddAdvice = () => {
    fetchAdDetails();
  };


  const formatName = (firstName, lastName) => {
    if (!firstName || !lastName) {
      return "Utilisateur inconnu";
    }
    return `${firstName} ${lastName.charAt(0)}.`;
  };

  const navigateToMessageScreen = () => {
    navigation.navigate("MessageScreen", { userId });
  };

  const renderPlantCard = (plant) => (
    <View key={plant.plantid} style={styles.plantCard}>
      <View style={styles.plantHeader}>
        <Text style={styles.plantTitle}>{plant.name_plant}</Text>
        <Text style={styles.plantCategory}>{plant.categoryname} / {plant.subcategoryname}</Text>
      </View>
      <Text style={styles.text}>Description : {plant.description}</Text>

      {plant.images.length > 0 && (
        <View style={styles.carouselContainer}>
          <Carousel
            data={plant.images}
            renderItem={({ item }) => (
              <Image source={{ uri: `data:image/jpeg;base64,${item.image}` }} style={styles.image} />
            )}
            sliderWidth={windowDimensions.width - 40}
            itemWidth={windowDimensions.width - 40}
            onSnapToItem={(index) => setActiveSlide((prev) => ({ ...prev, [plant.plantid]: index }))}
          />
          <Pagination
            dotsLength={plant.images.length}
            activeDotIndex={activeSlide[plant.plantid] || 0}
            containerStyle={styles.paginationContainer}
            dotStyle={styles.paginationDot}
            inactiveDotStyle={styles.inactiveDot}
          />
        </View>
      )}
      {plant.advice.length > 0 ? (
        <View style={styles.adviceContainer}>
          <Text style={styles.adviceTitle}>Conseils :</Text>
          {plant.advice.map((advice) => (
            <View key={advice.adviceid} style={styles.adviceCard}>
              <Text style={styles.adviceContent}>{advice.content}</Text>
              <Text style={styles.adviceAuthor}>Posté par : {formatName(advice.firstname, advice.lastname)}</Text>
              <Text style={styles.adviceDate}>Le {new Date(advice.creationdate).toLocaleDateString()}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noAdviceText}>Soyez le premier à donner un conseil</Text>
      )}
      <AddAdviceForm plantId={plant.plantid} onAddAdvice={handleAddAdvice} />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView>
        <View style={styles.header}>
          <ButtonEdit
            style={styles.sendButton}
            theme="primary-border-small"
            label="Retour"
            onPress={handleGoBack}
          />
          {loading && <ActivityIndicator size="small" color="#A3D288" />}
        </View>
        {!loading && adData && (
          <View style={{ flex: 1, padding: 10 }}>
            <Text style={styles.title}>{adData.advertisementtitle}</Text>

            <Text style={styles.text}>
              Du {new Date(adData.startdate).toLocaleDateString()} au {new Date(adData.enddate).toLocaleDateString()}
            </Text>
            <Text style={styles.text}>
              Localisation : {adData.city} - {adData.postal_code}
            </Text>
            <Text style={styles.text}>
              Posté par : {formatName(adData.first_name, adData.last_name)}
            </Text>
            <ButtonEdit
              style={styles.messageButton}
              theme="primary-border-small"
              label="message"
              onPress={navigateToMessageScreen}
            />

            <View style={styles.plantsContainer}>
              <Text style={styles.title}>Plantes associées :</Text>
              {plantsData.length > 0 ? (
                plantsData.map(renderPlantCard)
              ) : (
                <Text style={styles.text}>Aucune plante associée trouvée.</Text>
              )}
            </View>
            <View style={styles.mapContainer}>
              <Text style={styles.text}>Zone de gardiennage :</Text>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: adData.latitude,
                  longitude: adData.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Circle
                  center={{
                    latitude: adData.latitude,
                    longitude: adData.longitude,
                  }}
                  radius={200} // 200 mètres
                  fillColor="#A3D28880"
                />
              </MapView>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  sendButton: {
    padding: 10,
  },
  title: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: "bold",
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
  mapContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  map: {
    width: windowDimensions.width - 20,
    height: windowDimensions.height * 0.3,
    borderRadius: 10,
  },
  plantsContainer: {
    marginTop: 20,
  },
  plantCard: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  plantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plantTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  plantCategory: {
    fontSize: 16,
    color: "#767676",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  carouselContainer: {
    marginTop: 10,
  },
  paginationContainer: {
    paddingTop: 10,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
  },
  inactiveDot: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  adviceContainer: {
    marginTop: 10,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  adviceCard: {
    marginTop: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  adviceContent: {
    fontSize: 16,
  },
  adviceAuthor: {
    fontSize: 14,
    color: "#767676",
  },
  adviceDate: {
    fontSize: 14,
    color: "#767676",
  },
  noAdviceText: {
    fontSize: 16,
    color: "#767676",
    marginVertical: 5,
  },
});

export default AdvertisementDetailScreen;
