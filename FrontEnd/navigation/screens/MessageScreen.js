import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import ButtonEdit from "../../components/button";

const loading = true;

const handleGoBack = () => {
  useNavigation.goBack();
};


export default function ChatScreen() {
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
