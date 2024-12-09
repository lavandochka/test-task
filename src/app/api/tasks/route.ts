import { NextResponse } from 'next/server';
import connect from '../../../lib/mongodb';
import Task from '../../../models/task';

export async function DELETE(req: Request) {
  await connect();

  try {
    const { searchParams } = new URL(req.url!);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (err: unknown) {
    console.error("Error deleting task:", err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 });
  }
}

// GET: Получить все задачи
export async function GET() {
  await connect();

  try {
    const tasks = await Task.find(); // Получение всех задач
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
