import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, Entypo, FontAwesome5, Ionicons } from '@expo/vector-icons';

const Index = () => {
  const [task, setTask] = useState('');
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');

  useEffect(() => {
    loadTask();
  }, []);

  useEffect(() => {
    saveTask();
  }, [list]);

  // Load tasks from AsyncStorage
  const loadTask = async () => {
    try {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved !== null) {
        setList(JSON.parse(saved));
      }
      console.log('Data berhasil dimuat');
    } catch (error) {
      console.log('Data gagal dimuat', error);
    }
  };

  // Save tasks to AsyncStorage
  const saveTask = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(list));
      console.log('Data berhasil disimpan');
    } catch (error) {
      console.log('Data gagal disimpan', error);
    }
  };

  // Add a new task
  const addTask = () => {
    if (task.trim() === '') return;

    const newTask = {
      id: Date.now().toString(),
      title: task.trim(),
      checkbox: false,
    };

    setList([...list, newTask]);
    setTask('');
  };

  // Delete task by id
  const handleDelete = (id: string) => {
    const filtered = list.filter((item) => item.id !== id);
    setList(filtered);
  };

  // Confirm edit and save the updated task
  const handleEdit = () => {
    const updated = list.map((item) =>
      item.id === editId ? { ...item, title: task.trim() } : item
    );

    setList(updated);
    setTask('');
    setIsEditing(false);
    setEditId('');
  };

  // Start editing a task
  const startEdit = (item: any) => {
    setTask(item.title);
    setIsEditing(true);
    setEditId(item.id);
  };

  // Toggle checkbox state
  const handleCheckbox = (id: string) => {
    const updated = list.map((item) =>
      item.id === id ? { ...item, checkbox: !item.checkbox } : item
    );
    setList(updated);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`p-4 mt-20`}>
        <View>
          <Text style={tw`text-3xl font-bold mb-4`}>📑 nGopoyo</Text>

          <View style={tw`flex-row items-center mb-4`}>
            <TextInput
              value={task}
              onChangeText={setTask}
              style={tw`flex-1 border border-gray-600 rounded-md p-3 mr-2 text-lg bg-neutral-300`}
              placeholder="Mau ngapain hari ini?"
            />
            <TouchableOpacity
              onPress={isEditing ? handleEdit : addTask}
              style={tw`bg-blue-900 rounded-md`}
            >
              <Entypo
                name={isEditing ? 'check' : 'plus'}
                size={30}
                color="gray"
                style={tw`p-2`}
              />
            </TouchableOpacity>
          </View>

          <Text style={tw`ml-1 mb-2 text-xl font-bold text-gray-500`}>TO DO</Text>

          <View style={tw`bg-gray-100 p-4 rounded-md shadow-xl`}>
            <FlatList
              data={list}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={tw`flex-row items-center mb-4`}>
                  <TouchableOpacity
                    onPress={() => handleCheckbox(item.id)}
                    style={tw`mr-3`}
                  >
                    <Ionicons
                      name={item.checkbox ? 'checkbox' : 'square-outline'}
                      size={30}
                      color={item.checkbox ? 'green' : 'gray'}
                    />
                  </TouchableOpacity>

                  <Text style={tw`flex-1 text-base`}>{item.title}</Text>

                  <View style={tw`flex-row`}>
                    <TouchableOpacity
                      onPress={() => startEdit(item)}
                      style={tw`bg-blue-600 px-3 py-1 rounded-md mr-2`}
                    >
                      <Entypo name="pencil" size={20} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      style={tw`bg-red-700 px-3 py-1 rounded-md`}
                    >
                      <FontAwesome5 name="trash" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
