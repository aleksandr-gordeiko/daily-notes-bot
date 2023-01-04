import { Bot, Context, session } from 'grammy';
import type { Conversation, ConversationFlavor } from '@grammyjs/conversations';
import { conversations, createConversation } from '@grammyjs/conversations';

import { connectDB, closeConnection } from './db';

import error from './middlewares/error';
import onMessage from './onMessage';
import login from './commands/login';
import logout from './commands/logout';

export type CustomContext = Context & ConversationFlavor;
export type LoginConversation = Conversation<CustomContext>;

const bot = new Bot<CustomContext>(process.env.BOT_API_TOKEN);

bot.use(error);
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

bot.use(createConversation(login, 'login'));
bot.command('login', async (ctx) => {
  await ctx.conversation.enter('login');
});

bot.command('logout', logout);

bot.on('message:text', onMessage);

process.once('SIGINT', () => {
  closeConnection()
    .then(() => console.log('SIGINT occurred, exiting'))
    .catch(() => console.log('SIGINT occurred, exiting with no db connection closed'));
});
process.once('SIGTERM', () => {
  closeConnection()
    .then(() => console.log('SIGTERM occurred, exiting'))
    .catch(() => console.log('SIGTERM occurred, exiting with no db connection closed'));
});

connectDB()
  .then(() => bot.start())
  .catch((err) => console.log(err));
