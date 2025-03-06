import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import TaskList from "@/components/TaskList";
import TaskModal from "@/components/TaskModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        setAllTasks(tasks);
      }
    } catch (error) {
      console.error("Error loading tasks", error);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = allTasks.filter((task) => {
      const searchLower = text.toLowerCase();
      const textMatch = task.text.toLowerCase().includes(searchLower);
      const priorityMatch = task.priority.toLowerCase().includes(searchLower);
      const dateMatch = new Date(task.createdAt)
        .toLocaleString("th-TH")
        .toLowerCase()
        .includes(searchLower);

      return textMatch || priorityMatch || dateMatch;
    });

    setSearchResults(filtered);
  };

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleToggleComplete = async (id) => {
    const updatedTasks = allTasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setAllTasks(updatedTasks);
    handleSearch(searchQuery);
  };

  const handleEdit = (id) => {
    // เพิ่มโค้ดแก้ไขงาน
  };

  const handleDelete = async (id) => {
    const updatedTasks = allTasks.filter((task) => task.id !== id);
    await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setAllTasks(updatedTasks);
    handleSearch(searchQuery);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหารายการ..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#666"
        />
      </View>

      {searchQuery.trim() !== "" && (
        <ThemedText style={styles.resultCount}>
          พบ {searchResults.length} รายการ
        </ThemedText>
      )}

      {searchResults.length > 0 ? (
        <TaskList
          tasks={searchResults}
          onPress={handleTaskPress}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        searchQuery.trim() !== "" && (
          <ThemedText style={styles.noResultsText}>
            ไม่พบรายการที่ค้นหา
          </ThemedText>
        )
      )}

      <TaskModal
        visible={modalVisible}
        task={selectedTask}
        onClose={() => setModalVisible(false)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    fontFamily: "Kanit-Regular",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e1e4e8",
    fontSize: 16,
  },
  resultCount: {
    fontFamily: "Kanit-Regular",
    marginBottom: 10,
    color: "#666",
    fontSize: 14,
  },
  noResultsText: {
    fontFamily: "Kanit-Regular",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
});
