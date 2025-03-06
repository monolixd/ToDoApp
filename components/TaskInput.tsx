import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

// ✅ กำหนดชนิดของ Props
interface TaskInputProps {
  task: string;
  setTask: (text: string) => void;
  priority: string;
  setPriority: (priority: string) => void;
  onSubmit: () => void;
  editingTaskId: string | null;
}

const TaskInput: React.FC<TaskInputProps> = ({
  task,
  setTask,
  priority,
  setPriority,
  onSubmit,
  editingTaskId,
}) => {
  return (
    <View>
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

      <TouchableOpacity style={styles.addButton} onPress={onSubmit}>
        <Text style={styles.addButtonText}>
          {editingTaskId ? "บันทึกการแก้ไข" : "เพิ่มรายการ"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskInput;

const styles = StyleSheet.create({
  input: {
    fontFamily: 'Kanit-Regular',
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
    fontFamily: 'Kanit-Regular',
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
    fontFamily: 'Kanit-Medium',
    color: "white",
    fontSize: 16,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
