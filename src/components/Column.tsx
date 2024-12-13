import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

type Task = {
  _id: string;
  title: string;
  category: { _id: string; name: string };
  status: 'to-do' | 'in-progress' | 'done';
};

const Column = ({ status, tasks, onDeleteTask,  }: { status: string; tasks: Task[]; onDeleteTask: (taskId: string) => void;  }) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="flex-1 bg-gray-100 p-4 rounded-md">
      <h2 className="text-lg font-semibold mb-4">{status.toUpperCase()}</h2>
      <SortableContext items={tasks.map((task) => task._id)} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onDelete={onDeleteTask} />
        ))}
      </SortableContext>
    </div>
  );
};

export default Column;
