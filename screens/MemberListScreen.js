import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../config/firebase';


export default function MemberListScreen({ navigation }) {
  const [members, setMembers] = useState([]);

  const addMember = (newMember) => {
    setMembers([...members, { id: Math.random().toString(), name: newMember }]);
  };

  useEffect(() => {
    const membersRef = ref(db, 'members');

    //manggil data member dari db
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


  return (
    <View style={styles.container}>
      <View marginTop={60} marginBottom={20}>
        <Text style={styles.titleText}>Member List</Text>
      </View>
      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.memberItem}>
            <Text style={styles.memberName}>{item.name}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add Member', { addMember })} > 
        <Text style={styles.buttonText}>Add New Member</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,  
  },
  memberItem: {
    height: 48,
    padding: 10,
    backgroundColor: '#e6e6e6',
    borderRadius:100,
    marginBottom: 16,
  },
  memberName: {
    fontSize: 18,
    color: '#171717'
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
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign:'center',
  },
  
});
