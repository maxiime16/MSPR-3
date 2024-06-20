import React, { useState, useEffect, useCallback } from "react";
import { View, SafeAreaView, StatusBar, StyleSheet, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import ButtonEdit from "../../components/button";
import dayjs from "dayjs";

export default function MessageScreen() {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderCustomBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#7FB75F',
            marginBottom: 5, 
          },
          left: {
            backgroundColor: '#E1E1E1',
            marginBottom: 5, 
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          borderRadius: 30,
          marginLeft: 10,
          marginRight: 10,
          paddingTop: 10,
          backgroundColor: '#F0F0F0',
        }}
        primaryStyle={{ alignItems: 'center' }}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.header}>
        <ButtonEdit
          style={styles.backButton}
          theme="just-icon"
          icon="left"
          border="0"
          onPress={handleGoBack}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>React Native</Text>
        </View>
        <ButtonEdit
          style={styles.backButton}
          theme="just-icon"
          icon="reload1"
          border="0"
          onPress={handleGoBack}
        />
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        placeholder="Écrivez un message..."
        dateFormat={dayjs().locale('fr').format('LL')}
        timeFormat={dayjs().locale('fr').format('LT')}
        renderAvatar={null}
        renderBubble={renderCustomBubble}
        renderInputToolbar={renderInputToolbar}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  userInfo: {
    alignItems: 'center',
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  userName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sendButton: {
    marginRight: 10,
  },
});
