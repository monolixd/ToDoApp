import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("ต่ำ");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [sortOption, setSortOption] = useState("เพิ่มล่าสุด");

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
    if (task.trim() === "")
      return Alert.alert("แจ้งเตือน", "กรุณาใส่รายการที่ต้องทำ!");

    const newTask = {
      id: Date.now().toString(),
      text: task,
      priority: priority,
      createdAt: new Date().toISOString(), // ✅ บันทึกเป็น ISO string
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
    if (task.trim() === "")
      return Alert.alert("แจ้งเตือน", "กรุณาใส่รายการที่ต้องทำ!");
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
    } else if (option === "ความสำคัญมากไปน้อย") {
      const priorityOrder = { สูง: 3, ปานกลาง: 2, ต่ำ: 1 };
      sortedTasks.sort(
        (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
      );
    } else if (option === "ความสำคัญน้อยไปมาก") {
      const priorityOrder = { สูง: 3, ปานกลาง: 2, ต่ำ: 1 };
      sortedTasks.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }

    setTasks(sortedTasks);
    setSortOption(option);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📝 รายการสิ่งที่ต้องทำ</Text>

      <TextInput
        style={styles.input}
        placeholder="เพิ่มรายการที่ต้องทำ..."
        value={task}
        onChangeText={setTask}
      />

      <Picker
        selectedValue={priority}
        style={styles.picker}
        onValueChange={(itemValue) => setPriority(itemValue)}
      >
        <Picker.Item label="ความสำคัญ: ต่ำ🟢" value="ต่ำ" />
        <Picker.Item label="ความสำคัญ: ปานกลาง🟡" value="ปานกลาง" />
        <Picker.Item label="ความสำคัญ: สูง🔴" value="สูง" />
      </Picker>

      <TouchableOpacity
        style={styles.addButton}
        onPress={editingTaskId ? updateTask : addTask}
      >
        <Text style={styles.addButtonText}>
          {editingTaskId ? "บันทึกการแก้ไข" : "เพิ่มรายการ"}
        </Text>
      </TouchableOpacity>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>จัดเรียงตาม:</Text>
        <Picker
          selectedValue={sortOption}
          style={styles.sortPicker}
          onValueChange={(itemValue) => sortTasks(itemValue)}
        >
          <Picker.Item label="เพิ่มล่าสุด" value="เพิ่มล่าสุด" />
          <Picker.Item label="เพิ่มนานสุด" value="เพิ่มนานสุด" />
          <Picker.Item label="ความสำคัญมากไปน้อย" value="ความสำคัญมากไปน้อย" />
          <Picker.Item label="ความสำคัญน้อยไปมาก" value="ความสำคัญน้อยไปมาก" />
        </Picker>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        extraData={tasks} // ✅ ทำให้ FlatList รู้ว่าข้อมูลเปลี่ยน
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <View style={styles.taskContent}>
              <Text
                style={[
                  styles.taskText,
                  item.completed && styles.completedTaskText,
                ]}
              >
                {item.text}
              </Text>
              <Text style={styles.timeText}>
                {new Date(item.createdAt).toLocaleString("th-TH")}
              </Text>
            </View>
            <View
              style={[
                styles.priorityBadge,
                {
                  backgroundColor:
                    item.priority === "สูง"
                      ? "#dc3545"
                      : item.priority === "ปานกลาง"
                      ? "#ffc107"
                      : "#28a745",
                },
              ]}
            >
              <Text style={styles.priorityText}>
                {item.priority === "สูง"
                  ? "🔴 สูง"
                  : item.priority === "ปานกลาง"
                  ? "🟡 ปานกลาง"
                  : "🟢 ต่ำ"}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => toggleTaskCompletion(item.id)}
            >
              <Text style={styles.completeText}>
                {item.completed ? "☑️" : "⬜"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => editTask(item.id)}
            >
              <Text style={styles.editText}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTask(item.id)}
            >
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f2f5",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1a73e8",
    textAlign: "center",
    paddingVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e1e4e8",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "white",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e1e4e8",
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
    marginRight: 10,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 4,
  },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  deleteText: {
    fontSize: 18,
    color: "#dc3545",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  addButton: {
    backgroundColor: "#1a73e8",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  completeButton: {
    backgroundColor: "#e7f3fe",
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#cfe2ff",
  },
  completeText: {
    fontSize: 18,
    color: "#1a73e8",
  },
  editButton: {
    backgroundColor: "#e7f3fe",
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#cfe2ff",
  },
  editText: {
    fontSize: 18,
    color: "#1a73e8",
  },
  deleteButton: {
    backgroundColor: "#ffebee",
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sortLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  sortPicker: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e1e4e8",
  },
});
