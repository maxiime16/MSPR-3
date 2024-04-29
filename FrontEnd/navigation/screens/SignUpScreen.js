import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { IP_Auth } from "../../components/const";
import ButtonEdit from "../../components/button";
import Checkbox from 'expo-checkbox';

const IP = IP_Auth;
const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecked, setChecked] = useState(false);

  const handleSubmit = () => {
    // Vérification des champs du formulaire
    if (!firstName || !lastName || !email || !password) {
      setErrorMessage("Veuillez remplir tous les champs du formulaire.");
      return;
    }


    // Vérification du format de l'adresse e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    // Vérification du format du mot de passe
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Le mot de passe doit contenir au moins une minuscule, une majuscule, un numéro et être d'au moins 8 caractères."
      );
      return;
    }

    // Réinitialiser le message d'erreur s'il n'y a pas d'erreur de validation
    setErrorMessage("");

    // Création de l'objet contenant les données du formulaire
    const userData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    };

    fetch(`${IP}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        onChangeText={(text) => setFirstName(text)}
        value={firstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nom"
        onChangeText={(text) => setLastName(text)}
        value={lastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} color={isChecked ? '#7FB75F' : undefined}/>
        <View >
          <Text style={styles.paragraph}>En cochant cette case, j'accepte les </Text>
          <Text style={styles.loginRedirect} onPress={() => navigation.navigate('GeneralConditionsOfUse')}>
            conditions générales d'utilisation
          </Text>
        </View>
      </View>
      <Text style={styles.errorMessage}>{errorMessage}</Text>

      <View style={styles.sendButtonContainer}>
        <ButtonEdit
          style={styles.sendButton}
          theme="primary-full"
          label="S'inscrire"
          onPress={handleSubmit}
        />
      </View>
      <View style={styles.sendButtonContainer}>
        <ButtonEdit
          style={styles.sendButton}
          theme="primary-border"
          label="Se connecter"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </View>
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
    borderRadius:10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "black",
    marginRight: 10,
  },
  checked: {
    backgroundColor: "black",
  },
  loginRedirect:{
    textDecorationLine: 'underline',
    borderColor: 'black', 
    paddingBottom: 8,
  },
  sendButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  errorMessage: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default SignUpScreen;
