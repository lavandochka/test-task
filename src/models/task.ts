import mongoose, { Document, Schema } from 'mongoose';

interface ITask extends Document {
  title: string;
  category: mongoose.Schema.Types.ObjectId;
  status: 'В процессе' | 'Выполнено';
  createdAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    status: {
      type: String,
      enum: ['В процессе', 'Выполнено'],
      default: 'В процессе',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
