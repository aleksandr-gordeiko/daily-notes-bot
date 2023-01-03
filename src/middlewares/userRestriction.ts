import { Context } from 'grammy/out/context';

const userRestriction = async (ctx: Context, next: () => any) => {
  if (ctx.from.id.toString() !== process.env.TG_USER_ID) {
    await ctx.reply('Only the Dungeon Master can use this bot!');
  } else {
    await next();
  }
};

export default userRestriction;
