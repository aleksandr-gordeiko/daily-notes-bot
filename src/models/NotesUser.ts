import { Schema, model } from 'mongoose';

interface INotesUser {
  id: number;
  server: string;
  token: string;
}

const notesUserSchema = new Schema<INotesUser>({
  id: { type: Number, required: true, unique: true },
  server: { type: String, required: true },
  token: { type: String, required: false },
});

const NotesUser = model<INotesUser>('NotesUser', notesUserSchema);

export { NotesUser, INotesUser };
