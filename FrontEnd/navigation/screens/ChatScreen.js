import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import {
  connectSocket,
  disconnectSocket,
  onMessageReceived,
  onConnectionStatusChange,
  onUsersCountReceived
} from "../../services/socketService";

export default function ChatScreen() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    connectSocket();

    onMessageReceived((message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    onConnectionStatusChange((status) => {
      setConnected(status);
    });

    onUsersCountReceived((data) => {
      console.log("Mise à jour du nombre d'utilisateurs dans le composant:", data.count); // Un autre log si nécessaire
      setUserCount(data.count);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "#9b9b9b", marginBottom: 20 }}>
        {connected ? "Connecté au serveur." : "Connexion en cours..."}
      </Text>
      <Text style={{ color: "#9b9b9b", marginBottom: 20 }}>
        Utilisateurs connectés : {userCount}
      </Text>
      {messages.map((msg, index) => (
        <Text key={index} style={{ color: "#333" }}>
          {msg.text}
        </Text>
      ))}
    </View>
  );
}
