'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { DndContext, useDroppable, useDraggable, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };
  
  const closeTaskModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };
    


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

  // Handle drag and drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const draggedTaskId = active.id;
    const targetStatus = over.id as 'to-do' | 'in-progress' | 'done';

    const updatedTasks = tasks.map((task) =>
      task._id === draggedTaskId ? { ...task, status: targetStatus } : task
    );
    setTasks(updatedTasks);
  
    axios
    .put('/api/tasks', { id: draggedTaskId, status: targetStatus })  // Передаем id и status в теле запроса
    .then((response) => {
      console.log('Task updated successfully', response.data);
    })
    .catch((error) => {
      console.error('Failed to update task status:', error);
    });
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
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 text-black">
            {['to-do', 'in-progress', 'done'].map((status) => (
              <Column key={status} status={status} tasks={tasks.filter((task) => task.status === status)} />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
};

const Column = ({ status, tasks }: { status: string; tasks: Task[] }) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="flex-1 bg-gray-100 p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-4">{status.toUpperCase()}</h2>
      <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
};

const TaskCard = ({ task }: { task: Task }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task._id });
  const style = {
    transform: `translate(${transform?.x || 0}px, ${transform?.y || 0}px)`,
    
  };


  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded-md shadow-md mb-4"
    >
      <h3 className="font-bold text-black">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.category?.name}</p>
      <button
        onClick={() => alert(`Delete task ${task._id}`)}
        className="mt-2 text-sm text-red-500"
      >
        Delete
      </button>
    </div>
  );
};

export default KanbanBoard;
