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
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onPress,
  onToggleComplete,
  onEdit,
  onDelete,
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
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
  );
};

export default TaskList;
