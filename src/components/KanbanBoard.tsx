'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import Column from './Column';
import TaskForm from './TaskForm';



type Category = {
    _id: string;
    name: string;
  };

type Task = {
  _id: string;
  title: string;
  description?: string;
  category: { _id: string; name: string };
  status: 'to-do' | 'in-progress' | 'done';
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

 


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Error fetching categories. Please try again.');
      }
    };

    fetchCategories();
  }, []);

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

  const handleDeleteTask = async (taskId: string) => {
    try {
      setLoading(true);
  
      // Убедитесь, что используется правильный URL
      await axios.delete(`/api/tasks`, { params: { id: taskId } });
  
      // Обновите состояние задач
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', error);
    } finally {
      setLoading(false);
    }
  };
  
  


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
      .put('/api/tasks', { id: draggedTaskId, status: targetStatus })
      .catch((error) => console.error('Failed to update task status:', error));
  };



  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6" >Task Manager</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <TaskForm categories={categories} setTasks={setTasks} />

      {loading ? (
        <div className="text-center">Loading tasks...</div>
      ) : (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 text-black">
            {['to-do', 'in-progress', 'done'].map((status) => (
              <Column
                key={status}
                status={status}
                tasks={tasks.filter((task) => task.status === status)}
                onDeleteTask={handleDeleteTask}
                
              />
            ))}
          </div>
        </DndContext>
      )}

        
      
    </div>
  );
};

export default KanbanBoard;
