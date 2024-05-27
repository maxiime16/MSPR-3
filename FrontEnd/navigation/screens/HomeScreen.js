import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IP_Backend } from '../../components/const';
import AsyncStorage from "@react-native-async-storage/async-storage";

const IP = IP_Backend;

const HomeScreen = () => {
  const [categoriesWithAds, setCategoriesWithAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCategoriesWithAds();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error);
      }
    };

    fetchUserData();
  }, []);

  const fetchCategoriesWithAds = async () => {
    try {
      const response = await fetch(`${IP}/category`);
      const categoriesData = await response.json();
      const adsResponse = await fetch(`${IP}/advertisement/details`);
      const adsData = await adsResponse.json();

      if (!adsData.data) {
        throw new Error("Invalid advertisement data format");
      }

      const categoriesWithAdsData = categoriesData.data.map(category => {
        const adsForCategory = adsData.data.filter(ad => ad.categoryname === category.attributes.name);
        return { ...category.attributes, id: category.id, ads: adsForCategory };
      });

      setCategoriesWithAds(categoriesWithAdsData);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories et annonces :", error);
    }
  };

  const navigateToAdDetails = (adId) => {
    navigation.navigate("AdvertisementDetailScreen", { adId });
  };

  const renderAdItem = ({ item }) => {
    const truncatedTitle = item.advertisementtitle.length > 50 ? item.advertisementtitle.slice(0, 35) + "..." : item.advertisementtitle;
    const imageUri = item.firstimage ? `data:image/jpeg;base64,${item.firstimage}` : null;
    return (
      <TouchableOpacity onPress={() => navigateToAdDetails(item.advertisementid)}>
        <View style={styles.adContainer}>
          {imageUri && (
            <Image
              source={{ uri: imageUri }}
              style={styles.adImage}
            />
          )}
          <View style={styles.MoreInfoContainer}>
            <View style={styles.adTitleContainer}>
              <Text style={styles.adTitle}>{truncatedTitle}</Text>
              <View style={styles.MoreInfoContainer}>
                <View style={styles.locationContainer}>
                  <Text style={styles.adCity}>{item.city}</Text>
                  <Text style={styles.adPostaleCode}>{item.postal_code}</Text>
                </View>
                <View style={styles.dateContainer}>
                  <Text style={styles.adStartDate}>{new Date(item.startdate).toLocaleDateString()}</Text>
                  <Text> - </Text>
                  <Text style={styles.adEndDate}>{new Date(item.enddate).toLocaleDateString()}</Text>
                </View>
                <View style={styles.subCategoriesContainer}>
                  <Text style={styles.subCategories}>{item.subcategoryname}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18, color: "#767676", }}>{item.name}</Text>
      <Text style={{ fontWeight: "normal", fontSize: 14, color:"#989696", marginBottom: 20 }}>Types de plantes qui pourraient vous intéresser ...</Text>
      <FlatList
        data={item.ads}
        renderItem={renderAdItem}
        keyExtractor={(ad) => `${ad.advertisementid}-${item.id}`}
        horizontal={true}
        contentContainerStyle={styles.scrollViewContent}
      />
    </View>
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchCategoriesWithAds();
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des données :", error);
    }
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
        <ActivityIndicator size="large" color="#A3D288" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={categoriesWithAds}
        renderItem={renderCategoryItem}
        keyExtractor={(category) => category.id.toString()}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  adContainer:{
    width: 220,
    height: 280,
  },
  MoreInfoContainer:{
    flex: 1,
    justifyContent:"space-between"
  },
  adImage:{
    width: 220,
    height: 170,
    borderRadius: 25,
  },
  adTitleContainer: {
    height: 100,
    justifyContent: "center",
  },
  adTitle:{
    fontSize: 18,
    fontWeight:"bold",
    color:"#767676",
    marginHorizontal: 5,
  },
  locationContainer:{
    flexDirection:"row", 
    alignItems: 'flex-end', 
    gap: 4,
    marginHorizontal: 5,
  },
  adCity:{
    fontSize: 16,
    fontWeight: 'medium',
    color:"#4A4A4A",
  },
  adPostaleCode:{
    color:"#4A4A4A"
  },
  dateContainer:{
    flexDirection: "row",
    marginHorizontal: 5,
  },
  adStartDate:{
    color:"#4A4A4A",
  },
  adEndDate:{
    color:"#4A4A4A",
  },
  subCategoriesContainer:{
    marginTop: 5,
    backgroundColor:"#D9D9D9",
    width: "auto",
    alignSelf: 'flex-start',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  subCategories:{
    color:"#767676",
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  scrollViewContent: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
});
