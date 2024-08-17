import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { ref, set } from 'firebase/database';
import { db } from '../config/firebase';

export default function AddMemberScreen({ navigation }) {
  const [name, setName] = useState('');


  const handleAddMember = async () => {
    if (name.trim()) {
      try {
        const newMemberRef = ref(db, 'members/' + new Date().getTime());

        // nyimpen data ke db 
        await set(newMemberRef, {
          name: name,
        });

        navigation.goBack();
      } catch (error) {
        console.error('Error: ', error);
        Alert.alert('Gagal menambahkan member. Coba lagi.');
      }
    } else {
      Alert.alert('Perhatian!','Tolong masukkan nama yang valid.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter member name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddMember}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    height: 48,
    backgroundColor: '#6376FF',
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    padding: 10,
    margin: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 100,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
