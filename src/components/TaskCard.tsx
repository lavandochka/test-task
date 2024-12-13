import { useDraggable } from '@dnd-kit/core';
import { TrashIcon } from '@heroicons/react/24/solid';

type Task = {
  _id: string;
  title: string;
  category: { _id: string; name: string };
};


const TaskCard = ({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task._id });
  const style = { transform: `translate(${transform?.x || 0}px, ${transform?.y || 0}px)` };

    return (
      <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners} className="bg-white p-3 rounded-md shadow-md mb-4 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-black">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.category?.name}</p>
        </div>
        <button
          onClick={() => onDelete(task._id)}
          className="text-red-500 hover:text-red-700"
          aria-label="Delete Task"
        >
          <TrashIcon className="w-6 h-6" />
        </button>
      </div>
    );
  };
  
  

export default TaskCard;
