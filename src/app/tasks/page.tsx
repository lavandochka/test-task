'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

type Task = {
  _id: string;
  title: string;
  category: string;
  status: 'to-do' | 'in-progress' | 'done';
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    category: '',
    status: 'to-do',
  });

  // Fetch tasks from the server
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Handle new task submission
  const handleCreateTask = async () => {
    try {
      const response = await axios.post('/api/tasks', newTask);
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setNewTask({ title: '', category: '', status: 'to-do' }); // Reset form
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`/api/tasks?id=${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>

      {/* Task Form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New Task</h2>
        <input
          type="text"
          placeholder="Task title"
          className="border rounded-md p-2 w-full mb-2 text-black"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          className="border rounded-md p-2 w-full mb-2 text-black"
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
        />
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
        >
          Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4">
        {/* Column: To-Do */}
        <div className="flex-1 bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-4 text-black">To-Do</h2>
          {tasks
            .filter((task) => task.status === 'to-do')
            .map((task) => (
              <div
                key={task._id}
                className="bg-white p-3 rounded-md mb-4 shadow-md"
              >
                <h3 className="font-bold text-black">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.category}</p>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="mt-2 text-sm text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>

        {/* Column: In Progress */}
        <div className="flex-1 bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-4 text-black">In Progress</h2>
          {tasks
            .filter((task) => task.status === 'in-progress')
            .map((task) => (
              <div
                key={task._id}
                className="bg-white p-3 rounded-md mb-4 shadow-md"
              >
                <h3 className="font-bold text-black">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.category}</p>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="mt-2 text-sm text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>

        {/* Column: Done */}
        <div className="flex-1 bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-4 text-black">Done</h2>
          {tasks
            .filter((task) => task.status === 'done')
            .map((task) => (
              <div
                key={task._id}
                className="bg-white p-3 rounded-md mb-4 shadow-md"
              >
                <h3 className="font-bold">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.category}</p>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="mt-2 text-sm text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;
