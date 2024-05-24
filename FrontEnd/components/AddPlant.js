import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import ButtonEdit from "./button";
import ImageViewer from "./imageViewer";
import ImagePickerModal from "./imagePickerModal";
import { IP_Backend } from "./const";

const IP = IP_Backend;

export default function AddPlant({ onPlantAdd }) {
  const [plantName, setPlantName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [subCategoryValue, setSubCategoryValue] = useState(null);
  const [subCategoryItems, setSubCategoryItems] = useState([]);
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get(`${IP}/category`);
        const categoriesFromApi = response.data.data;
        const adaptedCategories = categoriesFromApi.map((category) => ({
          label: category.attributes.name,
          value: category.id,
        }));
        setCategoryItems(adaptedCategories);
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la récupération des catégories :",
          error
        );
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchSubCategories() {
      try {
        if (categoryValue) {
          const response = await axios.get(
            `${IP}/subCategory/category/${categoryValue}`
          );
          const subCategoriesFromApi = response.data.data;
          const adaptedSubCategories = subCategoriesFromApi.map(
            (subCategory) => ({
              label: subCategory.attributes.name,
              value: subCategory.id,
            })
          );
          setSubCategoryItems(adaptedSubCategories);
        }
      } catch (error) {
        console.error(
          "Une erreur s'est produite lors de la récupération des sous-catégories :",
          error
        );
      }
    }
    fetchSubCategories();
  }, [categoryValue]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const dateString = new Date().toISOString().split("T")[0];
      const resizedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 500, height: 500 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );
      const base64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const newImage = {
        uri: resizedImage.uri,
        base64: base64,
        name: `image${images.length + 1}-${dateString}.jpg`,
      };
      setImages((prevImages) => [...prevImages, newImage]);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const dateString = new Date().toISOString().split("T")[0];
      const resizedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 500, height: 500 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );
      const base64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const newImage = {
        uri: resizedImage.uri,
        base64: base64,
        name: `image${images.length + 1}-${dateString}.jpg`,
      };
      setImages((prevImages) => [...prevImages, newImage]);
    }
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleAddPlant = () => {
    if (
      plantName &&
      description &&
      categoryValue &&
      subCategoryValue &&
      images.length > 0
    ) {
      const plantData = {
        plantName,
        description,
        categoryValue,
        subCategoryValue,
        images,
      };
      onPlantAdd(plantData);
    } else {
      console.error(
        "Veuillez remplir tous les champs et ajouter au moins une image."
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView style={styles.container} nestedScrollEnabled={true}>
        <Text style={styles.label}>Nom de la plante</Text>
        <TextInput
          style={styles.input}
          value={plantName}
          placeholder="Nom de la plante"
          onChangeText={setPlantName}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={description}
          placeholder="Description"
          onChangeText={setDescription}
          multiline
        />
        <View style={styles.dropDownPicker}>
          <DropDownPicker
            open={categoryOpen}
            value={categoryValue}
            items={categoryItems}
            setOpen={setCategoryOpen}
            setValue={setCategoryValue}
            setItems={setCategoryItems}
            disableBorderRadius={true}
            listMode="MODAL"
            modalAnimationType="slide"
            modalTitle="Sélectionner une catégorie"
            placeholder="Catégorie"
            placeholderStyle={{ color: "grey" }}
            showArrowIcon={true}
            mode="BADGE"
            searchable={true}
            searchTextInputProps={{ maxLength: 25 }}
            searchPlaceholder="Ex: Arbre..."
            searchContainerStyle={{
              borderColor: "white",
              borderBottomColor: "#dfdfdf",
            }}
            customItemLabelStyle={{ backgroundColor: "red" }}
            listParentLabelStyle={{ fontWeight: "bold" }}
            listChildContainerStyle={{ paddingLeft: 40 }}
            closeAfterSelecting={true}
            style={{ borderColor: "white", borderRadius: 0, marginBottom: 15 }}
          />
        </View>
        {categoryValue && (
          <View style={styles.dropDownPicker}>
            <DropDownPicker
              open={subCategoryOpen}
              value={subCategoryValue}
              items={subCategoryItems}
              setOpen={setSubCategoryOpen}
              setValue={setSubCategoryValue}
              setItems={setSubCategoryItems}
              disableBorderRadius={true}
              listMode="MODAL"
              modalAnimationType="slide"
              modalTitle="Sélectionner une sous-catégorie"
              placeholder="Sous-catégorie"
              placeholderStyle={{ color: "grey" }}
              showArrowIcon={true}
              mode="BADGE"
              searchable={true}
              searchTextInputProps={{ maxLength: 25 }}
              searchPlaceholder="Ex: Tulipe..."
              searchContainerStyle={{
                borderColor: "white",
                borderBottomColor: "#dfdfdf",
              }}
              customItemLabelStyle={{ backgroundColor: "red" }}
              listParentLabelStyle={{ fontWeight: "bold" }}
              listChildContainerStyle={{ paddingLeft: 40 }}
              closeAfterSelecting={true}
              style={{
                borderColor: "white",
                borderRadius: 0,
                marginBottom: 10,
              }}
            />
          </View>
        )}
        <View style={styles.imageContainer}>
          {images.length > 0 && (
            <ScrollView horizontal={true}>
              <View style={styles.imageAndButton}>
                {images.map((image, index) => (
                  <ImageViewer
                    key={`image-${index}`}
                    theme="deletable"
                    selectedImage={image.uri}
                    onDelete={() => handleDeleteImage(index)}
                    style={styles.imageItem}
                  />
                ))}
                <ButtonEdit
                  style={styles.buttonInImage}
                  theme="just-icon"
                  icon="plus"
                  onPress={() => setModalVisible(true)}
                />
              </View>
            </ScrollView>
          )}
          {images.length === 0 && (
            <ButtonEdit
              style={styles.buttonAddImage1}
              theme="primary-icon"
              icon="plus"
              label="Ajouter photos"
              onPress={() => setModalVisible(true)}
            />
          )}
        </View>
        <ButtonEdit
          style={styles.addButton}
          theme="primary-full"
          label="Ajouter la plante"
          onPress={handleAddPlant}
        />
        <ImagePickerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectFromGallery={pickImage}
          onTakePhoto={takePhoto}
        />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 15,
    color: "#9b9b9b",
    paddingVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "white",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  dropDownPicker: {
    marginBottom: 15,
  },
  imageContainer: {
    marginVertical: 15,
  },
  imageAndButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageItem: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  buttonInImage: {
    alignSelf: "center",
    backgroundColor: "green",
  },
  buttonAddImage1: {
    alignSelf: "center",
    backgroundColor: "blue",
  },
  addButton: {
    marginTop: 20,
  },
});
