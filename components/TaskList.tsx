import React from "react";
import { FlatList, StyleSheet } from "react-native";
import TaskItem from "./TaskItem";

// ✅ กำหนดชนิดของ Props
interface Task {
  id: string;
  text: string;
  priority: string;
  completed: boolean;
  createdAt: string;
}

interface TaskListProps {
  tasks: Task[];
  onPress: (task: Task) => void;
  onToggleComplete: (id: string) => void;
  onEdit?: (id: string) => void; // ทำให้ optional
  onDelete?: (id: string) => void; // ทำให้ optional
  showActions?: boolean; // ✅ เพิ่ม prop สำหรับแสดงปุ่ม
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onPress,
  onToggleComplete,
  onEdit,
  onDelete,
  showActions = true, // ✅ ค่าเริ่มต้นให้มีปุ่มแก้ไข/ลบ
}) => {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      extraData={tasks}
      renderItem={({ item }) => (
        <TaskItem
          item={item}
          onPress={onPress}
          onToggleComplete={onToggleComplete}
          onEdit={showActions ? onEdit : undefined} // ✅ ถ้า showActions === false จะไม่ส่ง onEdit
          onDelete={showActions ? onDelete : undefined} // ✅ ถ้า showActions === false จะไม่ส่ง onDelete
        />
      )}
    />
  );
};

export default TaskList;
