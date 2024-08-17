import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue, remove } from 'firebase/database';


export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const db = getDatabase();
    const tasksRef = ref(db, 'tasks');

    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const taskList = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        setTasks(taskList);
      } else {
        setTasks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const editTask = (updatedTask) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const deleteTaskFromDatabase = (taskId) => {
    const db = getDatabase();
    const taskRef = ref(db, `tasks/${taskId}`);

    return remove(taskRef);
  };

  const deleteTask = (taskId) => {
    deleteTaskFromDatabase(taskId)
    .then(() => {
      setTasks(tasks.filter(task => task.id !== taskId));
    })
  };

  const addMember = (member) => {
    setMembers([...members, { id: Math.random().toString(), name: member }]);
  };

  return (
    <View style={styles.container}> 
      <View marginTop={60}>
        <Text style={styles.titleText}>Hi Mella!👋</Text>
        <Text style={styles.titleText}>Start A Day and Be Productive!</Text>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskDetails}>{`Due date: ${item.dueDate}`}</Text>
            <Text style={styles.taskDetails}>Tugas untuk: {item.members.map(m => m.name).join(', ')}</Text>

            <View style={styles.taskActions}>
              <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Edit Task', { task: item, editTask, members })}>
               <Icon name="edit" size={24} color="#6376FF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton} 
              onPress={() => deleteTask(item.id)}>
                <Icon name="trash" size={24} color="#6376FF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
      style={styles.button} 
      onPress={() => navigation.navigate('Add Task', { addTask, members })} >
        <Text style={styles.buttonText}>Add Task</Text> 
      </TouchableOpacity>

    </View>
  );
}

// style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  button: {
    height: 48,
    backgroundColor: '#6376FF',
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    padding: 12,
    margin: 12,
  },
   iconButton: {
    marginLeft: 12, 
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  taskItem: {
    padding: 15,
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    shadowColor: '#88888', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 0.5, 
    marginTop: 20,
    marginBottom: 8, 
  },
  taskTitle: {
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
  },
  taskDetails: {
    fontSize: 14, 
    color: '#666', 
    marginTop: 8, 
  },
  taskActions: {
    flexDirection: 'row', // Membuat ikon edit dan delete berjajar secara horizontal
    justifyContent: 'flex-end',
    marginTop: 12, // Jarak dari elemen di atasnya
  },
});
