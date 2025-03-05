import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";

// ✅ กำหนดชนิดของ Props
interface Task {
  id: string;
  text: string;
  priority: string;
  completed: boolean;
  createdAt: string;
}

interface TaskModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ visible, task, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>รายละเอียดงาน</Text>
          {task && (
            <>
              <Text style={styles.modalTaskText}>{task.text}</Text>
              <Text style={styles.modalInfoText}>
                วันที่สร้าง: {new Date(task.createdAt).toLocaleString("th-TH")}
              </Text>
              <Text
                style={[
                  styles.modalPriorityText,
                  {
                    color:
                      task.priority === "สูง"
                        ? "#dc3545"
                        : task.priority === "กลาง"
                        ? "#ffc107"
                        : "#28a745",
                  },
                ]}
              >
                ความสำคัญ: {task.priority}
              </Text>
              <Text style={styles.modalStatusText}>
                สถานะ: {task.completed ? "เสร็จสิ้น ✅" : "ยังไม่เสร็จ ⏳"}
              </Text>
            </>
          )}
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TaskModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
  modalTaskText: {
    fontSize: 18,
    color: "#2c3e50",
    marginBottom: 15,
    lineHeight: 24,
  },
  modalInfoText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 10,
  },
  modalPriorityText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
  },
  modalStatusText: {
    fontSize: 16,
    color: "#2c3e50",
    marginBottom: 20,
  },
  modalCloseButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalCloseText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
