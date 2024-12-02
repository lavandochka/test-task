// app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import connect from '../../../lib/mongodb';
import Task from '../../../models/task';

export async function GET() {
  await connect();
  
  try {
    const tasks = await Task.find().populate('category');
    return NextResponse.json(tasks);
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching tasks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connect();
  
  try {
    const { title, category, status } = await req.json();
    const newTask = new Task({ title, category, status });
    await newTask.save();
    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Error creating task' }, { status: 500 });
  }
}
