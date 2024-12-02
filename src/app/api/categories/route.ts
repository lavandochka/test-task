import connect from "@/lib/mongodb";
import category from "@/models/category";
import { NextResponse } from "next/server";

export async function GET(){
    await connect();
    try {
        const categories = await category.find();
        return NextResponse.json(categories)
    } catch (err) {
        return NextResponse.json({error: 'Error fetching categories'})
    }
}
export async function POST(req: Request) {
    await connect();
    
    try {
      const { name } = await req.json();
      const newTask = new category({ name });
      await newTask.save();
      return NextResponse.json(newTask, { status: 201 });
    } catch (err) {
      return NextResponse.json({ error: 'Error creating category' }, { status: 500 });
    }
  }