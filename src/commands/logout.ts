import { Context } from 'grammy';
import { deleteUser } from '../db';

const logout = async (ctx: Context) => {
  await deleteUser(ctx.from.id);
  await ctx.reply('You have been logged out');
};

export default logout;
