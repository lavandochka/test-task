'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

type Category = {
  _id: string;
  name: string;
};

type Task = {
  _id: string;
  title: string;
  category: Category;
  status: 'to-do' | 'in-progress' | 'done';
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    category: '',
    status: 'to-do',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories'); // Подразумевается, что у вас есть эндпоинт для категорий
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories. Please try again.');
      }
    };
  
    fetchCategories();
  }, []);
  

  // Fetch tasks from the server
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/tasks');
        setTasks(response.data);
      } catch (error) {
        setError('Error fetching tasks. Please try again.');
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle new task submission
  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.category) {
      alert('Please fill in both title and category');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/tasks', newTask);
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setNewTask({ title: '', category: '', status: 'to-do' }); // Reset form
    } catch (error) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      await axios.delete(`/api/tasks?id=${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Task Manager</h1>

      {/* Error handling */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

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

      {/* Kanban Board */}
      {loading ? (
        <div className="text-center">Loading tasks...</div>
      ) : (
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
                  <p className="text-sm text-gray-600">{task.category?.name}</p>
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
                  <p className="text-sm text-gray-600">{task.category?.name}</p>
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
                  className="bg-white p-3 rounded-md mb-4 shadow-md text-black"
                >
                  <h3 className="font-bold">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.category?.name}</p>
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
      )}
    </div>
  );
};

export default KanbanBoard;
