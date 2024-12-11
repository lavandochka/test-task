import { useDraggable } from '@dnd-kit/core';


type Task = {
  _id: string;
  title: string;
  category: { _id: string; name: string };
};

/*const TaskCard = ({ task, onDelete }: { task: Task; onDelete: (taskId: string) => void }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task._id });
  const style = { transform: `translate(${transform?.x || 0}px, ${transform?.y || 0}px)` };

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
        onClick={() => onDelete(task._id)}
        className="mt-2 text-sm text-red-500"
      >
        Delete
      </button>
    </div>
  );
};*/

const TaskCard = ({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) => (
    <div className="bg-white p-3 rounded-md shadow-md mb-4">
      <h3 className="font-bold text-black">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.category?.name}</p>
      <button
        onClick={() => onDelete(task._id)} // Передаем ID задачи для удаления
        className="mt-2 text-sm text-red-500"
      >
        Delete
      </button>
    </div>
  );
  

export default TaskCard;
