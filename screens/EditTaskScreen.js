import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, TouchableOpacity, Text, StyleSheet, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ref, onValue, update, getDatabase } from 'firebase/database';
import { db } from '../config/firebase';

export default function EditTaskScreen({ route, navigation }) {
  const { task, editTask } = route.params;
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(new Date(task.dueDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState(task.members);
  const [members, setMembers] = useState([]);


  const validateInputs = () => {
    if (title.trim() === '') {
      Alert.alert('Perhatian!', 'Task title tidak boleh kosong');
      return false;
    }

    if (selectedMembers.length === 0) {
      Alert.alert('Perhatian!', 'Silakan pilih setidaknya satu member.');
      return false;
    }

    return true;
  };

  useEffect(() => {
    const membersRef = ref(db, 'members');
    
    //manggil data list member dari db
    const unsubscribe = onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const memberList = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name
        }));
        setMembers(memberList);
      } else {
        setMembers([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditTask = () => {
    if (!validateInputs()) {
      return;
    }

    const updatedTask = {
      title,
      dueDate: format(dueDate, 'dd-MM-yyyy'),
      members: selectedMembers,
    };

    const db = getDatabase();
    const taskRef = ref(db, `tasks/${task.id}` );

    update(taskRef, updatedTask)
      .then(() => {
        console.log('Task berhasil diperbarui');
        editTask({ id: task.id, ...updatedTask });
        navigation.goBack();
      })
      .catch((error) => {
        console.error('Terjadi kesalahan saat memperbarui task: ', error);
        Alert.alert('Kesalahan', 'Tidak dapat memperbarui task. Silakan coba lagi.');
      });
  };

  const toggleMemberSelection = (member) => {
    setSelectedMembers((prevSelected) => {
      if (prevSelected.includes(member)) {
        return prevSelected.filter((m) => m !== member);
      } else {
        return [...prevSelected, member];
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Task Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Add task title"
        value={title}
        onChangeText={setTitle}
      />
      <View>
        <TouchableOpacity style={styles.outlineButton} onPress={() => setShowDatePicker(true)} >
          <Text style={styles.buttonText2}>Select Due Date</Text> 
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDueDate(selectedDate);
              }
            }}
          />
        )}
        <TextInput
          style={styles.input}
          value={`Due date: ${format(dueDate, 'dd-MM-yyyy')}`}
          editable={false}
        />
      </View>
      <Text style={styles.titleText}>Choose Members:</Text>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleMemberSelection(item)}>
            <Text style={selectedMembers.includes(item) ? styles.selectedMember : styles.member}>
              {item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={handleEditTask} >
        <Text style={styles.buttonText}>Save Changes</Text> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 100,
    marginBottom: 20,
    paddingHorizontal: 10,
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
  outlineButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: '#6376FF',
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    padding: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonText2: {
    color: '#6376FF',
    fontSize: 16,
    textAlign: 'center',
  },
  member: {
    height: 48,
    padding: 10,
    backgroundColor: '#e6e6e6',
    borderRadius:100,
    marginBottom: 16,
  },
  selectedMember: {
    height: 48,
    borderWidth: 1,
    borderRadius:100,
    borderColor: '#6376FF',
    padding: 10,
    backgroundColor: '#E8EAFF',
    marginBottom: 16,
  },
});
