import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import {
  connectSocket,
  disconnectSocket,
  onMessageReceived,
  onConnectionStatusChange,
} from "../../services/socketService";

export default function ChatScreen({}) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  // Fonction pour essayer de se connecter plusieurs fois
  const tryConnect = () => {
    console.log("Trying to connect...");
    connectSocket();

    let attempts = 0;
    const interval = setInterval(() => {
      if (!connected) {
        console.log("Re-attempting to connect...");
        connectSocket();
        attempts++;
        if (attempts >= 5) {
          clearInterval(interval);
          console.log("Failed to connect after 5 attempts.");
        }
      } else {
        clearInterval(interval);
        console.log("Connected!");
      }
    }, 5000); // Réessayer toutes les 5 secondes
  };

  useEffect(() => {
    tryConnect();
    // Établir la connexion au montage du composant
    console.log("Attempting to connect...");
    connectSocket();

    // Écouter l'événement de connexion
    onMessageReceived((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("Message reçu:", message);
    });

    // Mettre à jour l'état lors de la connexion
    onConnectionStatusChange((status) => {
      console.log("Connection status changed:", status);
      setConnected(status);
    });

    return () => {
      // Nettoyer la connexion au démontage du composant
      disconnectSocket();
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#9b9b9b", marginBottom: 20 }}>
        {connected ? "Connecté au serveur." : "Connexion en cours..."}
      </Text>
      {messages.map((msg, index) => (
        <Text key={index} style={{ color: "#333" }}>
          {msg.text}
        </Text>
      ))}
    </View>
  );
}
