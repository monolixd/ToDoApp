import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface TaskItemProps {
  item: {
    id: string;
    text: string;
    priority: string;
    completed: boolean;
    createdAt: string;
  };
  onPress: (item: {
    id: string;
    text: string;
    priority: string;
    completed: boolean;
    createdAt: string;
  }) => void;
  onToggleComplete: (id: string) => void;
  onEdit?: (id: string) => void; // ทำให้เป็น optional
  onDelete?: (id: string) => void; // ทำให้เป็น optional
  showActions?: boolean; // ✅ เพิ่ม prop ควบคุมการแสดงปุ่มแก้ไข/ลบ
}

const TaskItem: React.FC<TaskItemProps> = ({
  item,
  onPress,
  onToggleComplete,
  onEdit,
  onDelete,
  showActions = true, // ✅ ค่าเริ่มต้นให้แสดงปุ่ม
}) => {
  return (
    <View style={styles.taskContainer}>
      <View style={styles.taskContent}>
        <TouchableOpacity onPress={() => onPress(item)}>
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

      {/* ✅ ซ่อนปุ่มทั้งหมดถ้า showActions === false */}
      {showActions && (
        <>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => onToggleComplete?.(item.id)}
          >
            <Text style={styles.completeText}>
              {item.completed ? "☑️" : "⬜"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEdit?.(item.id)}
          >
            <Text style={styles.editText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete?.(item.id)}
          >
            <Text style={styles.deleteText}>🗑️</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({
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
    fontFamily: "Kanit-Medium",
    fontSize: 16,
    marginBottom: 6,
    color: "#2c3e50",
  },
  completedTaskText: {
    fontFamily: "Kanit-Regular",
    textDecorationLine: "line-through",
    color: "#95a5a6",
    fontStyle: "italic",
  },
  timeText: {
    fontFamily: "Kanit-Regular",
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
    fontFamily: "Kanit-Medium",
    fontSize: 12,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
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
    fontFamily: "Kanit-Regular",
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
    fontFamily: "Kanit-Regular",
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
    fontFamily: "Kanit-Regular",
    fontSize: 20,
    color: "#e74c3c",
  },
});
