import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const InputEdit = ({ label, theme }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (!text) {
      setIsFocused(false);
    }
  };

  const handleChangeText = (inputText) => {
    setText(inputText);
  };

    if (theme === 'labelInLine') {
        return (
            <View style={styles.container}>
                <View style={styles.entryarea}>
                    <TextInput type="text" style={styles.input} required />
                    <Text style={styles.labelline}>Test</Text>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.entryarea}>
                    <TextInput type="text" required />
                </View>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
      width: "100%",
    },
    entryarea: {
      position: 'relative',
      height: 70,
      width: "100%",
      margin: "auto",
    },
    input: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: "100%",
      outline: "none",
      fontSize: 14,
      borderColor: "gray",
      borderWidth: 1,
      paddingHorizontal: 10,
      borderRadius: 10,
      zIndex: 1,
    },
    labelline: {
      position: 'absolute',
      top: '50%',
      transform: [{ translateY: -25 }],
      left: 10,
      fontSize: 14,
      color: '#6e6e6e',
      zIndex: 0,
      transition: 'all 0.3s ease',
    },
  });
  

export default InputEdit;
