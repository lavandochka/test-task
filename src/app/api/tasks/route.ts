import { NextResponse } from 'next/server';
import connect from '../../../lib/mongodb';
import Task from '../../../models/task';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';

export async function DELETE(req: Request) {
  await connect();

  const url = new URL(req.url);
  const taskId = url.searchParams.get('id'); // Извлечение параметра id из строки запроса

  if (!taskId) {
    return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
  }

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error deleting task:', err);
    return NextResponse.json(
      { error: 'Error deleting task', details: (err as Error).message },
      { status: 500 }
    );
  }
}

// GET: Получить все задачи
export async function GET() {
  await connect();

  try {
    const tasks = await Task.find().populate('category'); // Получение всех задач
    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json(
      { error: "Error fetching tasks" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  await connect();
  const { id, status } = await req.json();

  const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
  return task
    ? NextResponse.json(task)
    : NextResponse.json({ error: 'Task not found' }, { status: 404 });
}

// POST: Создать новую задачу
export async function POST(req: Request) {
  await connect();

  try {
    const { title, category, status } = await req.json();

    if (!title || !category || !status) {
      return NextResponse.json(
        { error: "All fields (title, category, status) are required." },
        { status: 400 }
      );
    }

    const newTask = new Task({ title, category, status });
    const savedTask = await newTask.save();
    return NextResponse.json(savedTask, { status: 201 });
  } catch (err: unknown) {
    console.error("Error creating task:", err);
    if (err instanceof Error) {
      return NextResponse.json(
        { error: "Error creating task", details: err.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  await connect();

  try {
    const { id, status } = await req.json(); // Получаем id и status из тела запроса

    if (!id || !status) {
      return NextResponse.json(
        { error: "Task ID and new status are required." },
        { status: 400 }
      );
    }

    const updatedTask = await Task.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (err: unknown) {
    console.error("Error updating task:", err);
    return NextResponse.json(
      { error: "Error updating task" },
      { status: 500 }
    );
  }
}
