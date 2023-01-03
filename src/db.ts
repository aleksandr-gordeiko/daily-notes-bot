import { connect, connection } from 'mongoose';
import { NotesUser, INotesUser } from './models/NotesUser';

const url: string = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`;

const connectDB = async (): Promise<void> => {
  try {
    await connect(url);
  } catch (err) {
    throw new Error(`DB connection error: ${err}`);
  }
};

const closeConnection = async (): Promise<void> => {
  try {
    await connection.close();
  } catch (err) {
    throw new Error('DB connection closure fail');
  }
};

const saveOrUpdateUser = async (user: INotesUser): Promise<void> => {
  const users = await NotesUser.find({ id: user.id });
  if (users.length !== 0) {
    await NotesUser.updateOne({ id: user.id }, user);
  } else {
    await NotesUser.create(user);
  }
};

const getUser = async (id: number): Promise<INotesUser | undefined> => {
  const users = await NotesUser.find({ id });
  if (users.length !== 0) {
    return users[0];
  }
  return undefined;
};

const deleteUser = async (id: number): Promise<void> => {
  await NotesUser.deleteOne({ id });
};

export {
  connectDB,
  closeConnection,
  saveOrUpdateUser,
  getUser,
  deleteUser,
};
