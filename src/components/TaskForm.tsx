import { useState } from 'react';
import axios from 'axios';

type TaskFormProps = {
  categories: { _id: string; name: string }[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
};

const TaskForm = ({ categories, setTasks }: TaskFormProps) => {
  const [newTask, setNewTask] = useState({ title: '', category: '', status: 'to-do' });
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.category) {
      alert('Please fill in both title and category');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/tasks', newTask);
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setNewTask({ title: '', category: '', status: 'to-do' });
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Add New Task</h2>
      <input
        type="text"
        placeholder="Task title"
        className="border rounded-md p-2 w-full mb-2 text-black"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
      />
      <select
        className="border rounded-md p-2 w-full mb-2 text-black"
        value={newTask.category}
        onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>
      <select
          className="border rounded-md p-2 w-full mb-2 text-black"
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        >
          <option value="to-do">To-Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      <button
        onClick={handleCreateTask}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </div>
  );
};

export default TaskForm;
