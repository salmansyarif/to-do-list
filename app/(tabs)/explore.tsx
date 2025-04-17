import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Entypo, FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

interface Task {
  id: string;
  title: string;
  mapel: string;
  date: string;
  checkbox: boolean;
}

const Index = () => {
  const [task, setTask] = useState("");
  const [task2, setTask2] = useState("");
  const [task3, setTask3] = useState("");
  const [list, setList] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState("");
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditAlert, setShowEditAlert] = useState(false);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState("");

  useEffect(() => {
    loadTask();
  }, []);

  useEffect(() => {
    saveTask();
  }, [list]);

  const loadTask = async () => {
    try {
      const saved = await AsyncStorage.getItem("tasks");
      if (saved !== null) {
        setList(JSON.parse(saved));
      }
      console.log("Data berhasil dimuat");
    } catch (error) {
      console.log("Data gagal dimuat", error);
    }
  };

  const saveTask = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(list));
      console.log("Data berhasil disimpan");
    } catch (error) {
      console.log("Data gagal disimpan", error);
    }
  };

  const addTask = () => {
    if (task.trim() === "" || task2.trim() === "" || task3.trim() === "") return;
    setShowAddAlert(true);
  };

  const confirmAdd = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: task.trim(),
      mapel: task2.trim(),
      date: task3.trim(),
      checkbox: false,
    };

    setList([...list, newTask]);
    setTask("");
    setTask2("");
    setTask3("");
    setShowAddAlert(false);
  };

  const confirmDelete = (id: string) => {
    setTaskToDelete(id);
    setShowDeleteAlert(true);
  };

  const handleDelete = (id: string) => {
    const filtered = list.filter((item) => item.id !== id);
    setList(filtered);
    setShowDeleteAlert(false);
  };

  const handleEdit = () => {
    setShowEditAlert(true);
  };

  const confirmEdit = () => {
    const updated = list.map((item) =>
      item.id === editId
        ? {
            ...item,
            title: task.trim(),
            mapel: task2.trim(),
            date: task3.trim(),
          }
        : item
    );

    setList(updated);
    setTask("");
    setTask2("");
    setTask3("");
    setIsEditing(false);
    setEditId("");
    setShowEditAlert(false);
  };

  const startEdit = (item: Task) => {
    setTask(item.title);
    setTask2(item.mapel);
    setTask3(item.date);
    setIsEditing(true);
    setEditId(item.id);
  };

  const handleCheckbox = (id: string) => {
    const updated = list.map((item) =>
      item.id === id ? { ...item, checkbox: !item.checkbox } : item
    );
    setList(updated);
  };

  const handleDatePress = () => {
    setCalendarVisible(!calendarVisible);
  };

  const onDateSelect = (date: any) => {
    setSelectedDate(date.dateString);
    setTask3(date.dateString);
    setCalendarVisible(false);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`p-4 mt-10`}>
        <View>
          <Text style={tw`text-4xl mr-50 font-bold mb-7 text-center mt-15`}>📑 Tugasku</Text>

          {/* Form Input */}
          <View>
            <TextInput
              style={tw`bg-gray-100 p-5 rounded-xl text-lg text-black border border-gray-300 mb-3`}
              placeholder="Ada tugas apa hari ini?"
              placeholderTextColor="#888"
              value={task}
              onChangeText={setTask}
            />
            <TextInput
              style={tw`bg-gray-100 p-5 rounded-xl text-black text-lg  border border-gray-300 mb-3`}
              placeholder="Mapel apa?"
              placeholderTextColor="#888"
              value={task2}
              onChangeText={setTask2}
            />

            <View style={tw`flex-row items-center mb-4`}>
              <TextInput
                style={tw`flex-1 bg-gray-100 p-5 rounded-xl text-lg  text-black border border-gray-300`}
                placeholder="12 April 2025"
                placeholderTextColor="#888"
                value={task3}
                onChangeText={setTask3}
              />
              <TouchableOpacity
                style={tw`ml-2 bg-blue-900 p-5 rounded-lg`}
                onPress={handleDatePress}
              >
                <Ionicons name="calendar" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {calendarVisible && (
              <Calendar
                onDayPress={onDateSelect}
                markedDates={{ [selectedDate]: { selected: true, selectedColor: 'blue' } }}
                theme={{
                  todayTextColor: 'red',
                  arrowColor: 'purple',
                  monthTextColor: 'black',
                  textSectionTitleColor: 'blue',
                }}
              />
            )}

            <TouchableOpacity
              style={tw`bg-blue-900 w-full py-5  rounded-lg items-center justify-center mb-4`}
              onPress={isEditing ? handleEdit : addTask}
            >
              <Text style={tw`text-white font-bold text-xl`}>
                {isEditing ? "Simpan Perubahan" : "Tambah Tugas"}
              </Text>
            </TouchableOpacity>
          </View>




          {list.length > 0 && (
            <Text style={tw`ml-1 mt-3 mb-2 text-lg font-bold text-gray-500`}>
              ADA TUGAS NIH KAMU!!
            </Text>
          )}

          <FlatList
            scrollEnabled={false}
            data={list}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={() => (
              <Text style={tw`text-gray-500 text-center mt-10`}>
                🎉 YEEY GADA TUGAS KAMU
              </Text>
            )}
            renderItem={({ item }) => (
              <View
                style={tw`bg-white border-l-4 border-${
                  item.checkbox ? "green-600" : "red-600"
                } p-4 rounded-xl mb-4 flex-row items-center shadow-xl`}
              >
                <TouchableOpacity
                  onPress={() => handleCheckbox(item.id)}
                  style={tw`mr-3`}
                >
                  <Ionicons
                    name={item.checkbox ? "checkmark-done-circle" : "ellipse-outline"}
                    size={30}
                    color={item.checkbox ? "green" : "gray"}
                  />
                </TouchableOpacity>

                <View style={tw`flex-1`}>
                  <Text style={tw`font-bold text-lg text-gray-800`}>{item.title}</Text>
                  <Text style={tw`text-gray-600`}>Mapel: {item.mapel}</Text>
                  <Text style={tw`text-red-700 font-bold mt-1`}>
                    Tanggal: {item.date}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => startEdit(item)}
                  style={tw`bg-blue-900 p-2 rounded-lg mr-2`}
                >
                  <Entypo name="pencil" size={18} color="white" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => confirmDelete(item.id)}
                  style={tw`bg-red-700 p-2 rounded-lg`}
                >
                  <FontAwesome5 name="trash" size={18} color="white" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView>

      {/* Delete Modal */}
      <Modal
        transparent={true}
        visible={showDeleteAlert}
        animationType="fade"
        onRequestClose={() => setShowDeleteAlert(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white dark:bg-gray-800 rounded-xl p-5 w-80 shadow-xl`}>
            <View style={tw`items-center mb-4`}>
              <View style={tw`bg-red-100 p-4 rounded-full mb-2`}>
                <FontAwesome6 name="trash" size={30} color={tw.color('red-500')} />
              </View>
              <Text style={tw`text-xl font-bold text-black dark:text-white text-center`}>Konfirmasi Hapus</Text>
            </View>
            
            <Text style={tw`text-gray-600 dark:text-gray-300 text-center mb-5`}>
              Apakah kamu yakin ingin menghapus tugas ini?
            </Text>
            
            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                style={tw`bg-gray-200 dark:bg-gray-700 py-3 px-5 rounded-lg flex-1 mr-2`}
                onPress={() => setShowDeleteAlert(false)}
              >
                <Text style={tw`text-center text-black dark:text-white font-bold`}>Batal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={tw`bg-red-500 py-3 px-5 rounded-lg flex-1`}
                onPress={() => handleDelete(taskToDelete)}
              >
                <Text style={tw`text-white text-center font-bold`}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        transparent={true}
        visible={showEditAlert}
        animationType="fade"
        onRequestClose={() => setShowEditAlert(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white dark:bg-gray-800 rounded-xl p-5 w-80 shadow-xl`}>
            <View style={tw`items-center mb-4`}>
              <View style={tw`bg-blue-100 p-4 rounded-full mb-2`}>
                <FontAwesome6 name="edit" size={30} color={tw.color('blue-500')} />
              </View>
              <Text style={tw`text-xl font-bold text-black dark:text-white text-center`}>Konfirmasi Edit</Text>
            </View>
            
            <Text style={tw`text-gray-600 dark:text-gray-300 text-center mb-5`}>
              Apakah kamu yakin ingin mengubah tugas ini?
            </Text>
            
            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                style={tw`bg-gray-200 dark:bg-gray-700 py-3 px-5 rounded-lg flex-1 mr-2`}
                onPress={() => setShowEditAlert(false)}
              >
                <Text style={tw`text-center text-black dark:text-white font-bold`}>Batal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={tw`bg-blue-500 py-3 px-5 rounded-lg flex-1`}
                onPress={confirmEdit}
              >
                <Text style={tw`text-white text-center font-bold`}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Modal */}
      <Modal
        transparent={true}
        visible={showAddAlert}
        animationType="fade"
        onRequestClose={() => setShowAddAlert(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
          <View style={tw`bg-white dark:bg-gray-800 rounded-xl p-5 w-80 shadow-xl`}>
            <View style={tw`items-center mb-4`}>
              <View style={tw`bg-green-100 p-4 rounded-full mb-2`}>
                <FontAwesome6 name="plus" size={30} color={tw.color('green-500')} />
              </View>
              <Text style={tw`text-xl font-bold text-black dark:text-white text-center`}>Konfirmasi Tambah</Text>
            </View>
            
            <Text style={tw`text-gray-600 dark:text-gray-300 text-center mb-5`}>
              Apakah kamu yakin ingin menambah tugas ini?
            </Text>
            
            <View style={tw`flex-row justify-between`}>
              <TouchableOpacity
                style={tw`bg-gray-200 dark:bg-gray-700 py-3 px-5 rounded-lg flex-1 mr-2`}
                onPress={() => setShowAddAlert(false)}
              >
                <Text style={tw`text-center text-black dark:text-white font-bold`}>Batal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={tw`bg-green-500 py-3 px-5 rounded-lg flex-1`}
                onPress={confirmAdd}
              >
                <Text style={tw`text-white text-center font-bold`}>Tambah</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>





    </SafeAreaView>
      );
    };
    
    export default Index;