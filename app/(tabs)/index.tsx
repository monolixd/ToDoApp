import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal, 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
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
    if (task.trim() === "")
      return Alert.alert("แจ้งเตือน", "กรุณาใส่รายการที่ต้องทำ!");

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

    setTasks(sortedTasks);
    setSortOption(option);
  };

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
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
        <Picker.Item label="ความสำคัญ: กลาง🟡" value="กลาง" />
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
        extraData={tasks} 
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <View style={styles.taskContent}>
              <TouchableOpacity onPress={() => handleTaskPress(item)}>
                <Text
                  style={[
                    styles.taskText,
                    item.completed && styles.completedTaskText,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.text}
                </Text>
              </TouchableOpacity>
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
                      : item.priority === "กลาง"
                      ? "#ffc107"
                      : "#28a745",
                },
              ]}
            >
              <Text style={styles.priorityText}>
                {item.priority === "สูง"
                  ? "🔴 สูง"
                  : item.priority === "กลาง"
                  ? "🟡 กลาง"
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>รายละเอียดงาน</Text>
            {selectedTask && (
              <>
                <Text style={styles.modalTaskText}>{selectedTask.text}</Text>
                <Text style={styles.modalInfoText}>
                  วันที่สร้าง: {new Date(selectedTask.createdAt).toLocaleString("th-TH")}
                </Text>
                <Text style={[styles.modalPriorityText, {
                  color: selectedTask.priority === "สูง" 
                    ? "#dc3545" 
                    : selectedTask.priority === "กลาง"
                    ? "#ffc107"
                    : "#28a745"
                }]}>
                  ความสำคัญ: {selectedTask.priority}
                </Text>
                <Text style={styles.modalStatusText}>
                  สถานะ: {selectedTask.completed ? "เสร็จสิ้น ✅" : "ยังไม่เสร็จ ⏳"}
                </Text>
              </>
            )}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>ปิด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#2c3e50",
    textAlign: "center",
    paddingVertical: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e1e4e8",
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: "white",
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    color: "#2c3e50",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e1e4e8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "white",
    marginVertical: 8,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f1f1f1",
  },
  taskContent: {
    flex: 1,
    marginRight: 15,
  },
  taskText: {
    fontSize: 16,
    marginBottom: 6,
    color: "#2c3e50",
    fontWeight: "500",
  },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: "#95a5a6",
    fontStyle: "italic",
  },
  timeText: {
    fontSize: 12,
    color: "#7f8c8d",
    fontStyle: "italic",
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  addButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  completeButton: {
    backgroundColor: "#e8f4fd",
    padding: 10,
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#cfe2ff",
  },
  completeText: {
    fontSize: 20,
    color: "#3498db",
  },
  editButton: {
    backgroundColor: "#e8f4fd",
    padding: 10,
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#cfe2ff",
  },
  editText: {
    fontSize: 20,
    color: "#3498db",
  },
  deleteButton: {
    backgroundColor: "#fee8e7",
    padding: 10,
    borderRadius: 12,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  deleteText: {
    fontSize: 20,
    color: "#e74c3c",
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
    fontSize: 16,
    marginRight: 10,
    color: "#2c3e50",
    fontWeight: "500",
  },
  sortPicker: {
    flex: 1,
    height: 40,
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e1e4e8",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalTaskText: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 15,
    lineHeight: 24,
  },
  modalInfoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  modalPriorityText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  modalStatusText: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
