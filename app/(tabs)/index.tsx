import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker"; // นำเข้า Picker
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import TaskModal from "@/components/TaskModal";
import { useFonts } from 'expo-font';

export default function App() {
  const [loaded] = useFonts({
    'Kanit-Regular': require('../../assets/fonts/Kanit-Regular.ttf'),
    'Kanit-Medium': require('../../assets/fonts/Kanit-Medium.ttf'),
    'Kanit-Bold': require('../../assets/fonts/Kanit-Bold.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("ต่ำ");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [sortOption, setSortOption] = useState("เพิ่มล่าสุด");
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) setTasks(JSON.parse(storedTasks));
    } catch (error) {
      console.error("Error loading tasks", error);
    }
  };

  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
    } catch (error) {
      console.error("Error saving tasks", error);
    }
  };

  const addTask = () => {
    if (task.trim() === "") return;

    const newTask = {
      id: Date.now().toString(),
      text: task,
      priority: priority,
      createdAt: new Date().toISOString(),
      completed: false,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setTask("");
    setPriority("ต่ำ");
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find((item) => item.id === id);
    setTask(taskToEdit.text);
    setPriority(taskToEdit.priority);
    setEditingTaskId(id);
  };

  const updateTask = () => {
    if (task.trim() === "") return;

    const updatedTasks = tasks.map((item) =>
      item.id === editingTaskId
        ? { ...item, text: task, priority: priority }
        : item
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setTask("");
    setPriority("ต่ำ");
    setEditingTaskId(null);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((item) => item.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const sortTasks = (option) => {
    let sortedTasks = [...tasks];

    if (option === "เพิ่มล่าสุด") {
      sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (option === "เพิ่มนานสุด") {
      sortedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (option === "ความสำคัญสูงไปต่ำ") {
      const priorityOrder = { สูง: 3, กลาง: 2, ต่ำ: 1 };
      sortedTasks.sort(
        (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
      );
    } else if (option === "ความสำคัญต่ำไปสูง") {
      const priorityOrder = { สูง: 3, กลาง: 2, ต่ำ: 1 };
      sortedTasks.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }

    setTasks(sortedTasks); // ✅ อัปเดต React State ด้วยอาร์เรย์ที่จัดเรียงใหม่
    setSortOption(option);
  };

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 รายการสิ่งที่ต้องทำ</Text>

      <TaskInput
        task={task}
        setTask={setTask}
        priority={priority}
        setPriority={setPriority}
        onSubmit={editingTaskId ? updateTask : addTask}
        editingTaskId={editingTaskId}
      />

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>จัดเรียงตาม:</Text>
        <Picker
          selectedValue={sortOption}
          style={styles.sortPicker}
          onValueChange={(itemValue) => sortTasks(itemValue)}
        >
          <Picker.Item label="เพิ่มล่าสุด" value="เพิ่มล่าสุด" />
          <Picker.Item label="เพิ่มนานสุด" value="เพิ่มนานสุด" />
          <Picker.Item label="ความสำคัญสูงไปต่ำ" value="ความสำคัญสูงไปต่ำ" />
          <Picker.Item label="ความสำคัญต่ำไปสูง" value="ความสำคัญต่ำไปสูง" />
        </Picker>
      </View>

      <TaskList
        tasks={tasks}
        onPress={handleTaskPress}
        onToggleComplete={toggleTaskCompletion}
        onEdit={editTask}
        onDelete={deleteTask}
      />

      <TaskModal
        visible={modalVisible}
        task={selectedTask}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontFamily: 'Kanit-Bold',
    fontSize: 32,
    marginBottom: 25,
    color: "#2c3e50",
    textAlign: "center",
    paddingVertical: 15,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sortLabel: {
    fontFamily: 'Kanit-Medium',
    fontSize: 16,
    marginRight: 10,
    color: "#2c3e50",
  },
  sortPicker: {
    fontFamily: 'Kanit-Regular',
    flex: 1,
    height: 40,
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e1e4e8",
  },
});
