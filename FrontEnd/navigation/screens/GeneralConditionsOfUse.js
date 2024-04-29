import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, ScrollView } from "react-native";


const GeneralConditionsOfUse = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Conditions Générales d'Utilisation</Text>
            <Text style={styles.paragraph}>
                Merci d'utiliser notre application de gardiennage de plantes. En utilisant notre application, vous acceptez les conditions suivantes :
            </Text>
            <Text style={styles.numberedItem}>
                1. <Text style={styles.itemText}>Objet de l'Application :</Text> 
                {"\n"} - Notre application vise à aider les utilisateurs à surveiller et à entretenir leurs plantes d'intérieur et d'extérieur.
            </Text>
            <Text style={styles.numberedItem}>
                2. <Text style={styles.itemText}>Responsabilités de l'Utilisateur :</Text>
                {"\n"}- L'utilisateur est responsable de fournir des informations précises sur ses plantes.
                {"\n"}- L'utilisateur est responsable de suivre les recommandations fournies par l'application pour l'entretien des plantes.
            </Text>
            <Text style={styles.numberedItem}>
                3. <Text style={styles.itemText}>Données Utilisateur :</Text>
                {"\n"}- Les informations fournies par l'utilisateur, telles que le type de plante, les besoins en eau, etc., seront utilisées uniquement dans le but de fournir des conseils d'entretien des plantes.
                {"\n"}- Nous ne partagerons pas les informations de l'utilisateur avec des tiers sans son consentement.
            </Text>
            <Text style={styles.numberedItem}>
                4. <Text style={styles.itemText}>Utilisation Appropriée :</Text>
                {"\n"}- L'utilisateur s'engage à utiliser l'application de manière appropriée et légale.
                {"\n"}- L'utilisateur ne doit pas utiliser l'application pour des activités frauduleuses ou illicites.
            </Text>
            <Text style={styles.numberedItem}>
                5. <Text style={styles.itemText}>Responsabilité de l'Application :</Text>
                {"\n"}- Nous nous efforçons de fournir des informations précises et à jour sur l'entretien des plantes, mais nous ne pouvons garantir l'exactitude à tout moment.
                {"\n"}- Nous déclinons toute responsabilité en cas de dommages causés aux plantes de l'utilisateur en raison de l'utilisation de notre application.
            </Text>
            <Text style={styles.numberedItem}>
                6. <Text style={styles.itemText}>Modification des Conditions :</Text>
                {"\n"}- Nous nous réservons le droit de modifier ces conditions générales à tout moment. Les utilisateurs seront informés des modifications apportées aux conditions.
            </Text>
            
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.acceptButton}>
                <Text style={styles.acceptButtonText}>Retour</Text>
            </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? 24 : 0,
    marginTop: Platform.OS === 'ios' ? 44 : 0,
    marginHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  paragraph: {
    marginBottom: 20,
  },
  numberedItem: {
    marginBottom: 10,
  },
  itemText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  acceptButton: {
    backgroundColor: "#7FB75F",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default GeneralConditionsOfUse;
