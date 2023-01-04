import fetch from 'node-fetch';

import { NotesUser } from '../models/NotesUser';
import { saveOrUpdateUser } from '../db';
import type { CustomContext, LoginConversation } from '../index';
import { LoginResponse } from '../types';

const login = async (conv: LoginConversation, ctx: CustomContext) => {
  await ctx.reply('Please, provide the server address in the following format: https://example.com');
  const server = (await conv.form.url()).toString().slice(0, -1);

  await ctx.reply('Please, provide the username');
  const username = await conv.form.text();
  // @ts-ignore
  await ctx.api.deleteMessage(ctx.chat.id, conv.ctx.update.message.message_id);

  await ctx.reply('Please, provide the password');
  const password = await conv.form.text();
  // @ts-ignore
  await ctx.api.deleteMessage(ctx.chat.id, conv.ctx.update.message.message_id);

  if (!server || !username || !password) {
    await ctx.reply('You have provided invalid credentials');
    return;
  }

  const body = {
    username,
    password,
  };

  const res = await fetch(`${server}/api/login`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.5',
      'content-type': 'application/json;charset=UTF-8',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sec-gpc': '1',
      Referer: `${server}/auth/`,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
    body: JSON.stringify(body),
    method: 'POST',
  });

  console.log(res);

  if (res.status !== 200) {
    await ctx.reply('Error while logging in');
    return;
  }

  const user = new NotesUser({
    id: ctx.from.id,
    server,
    token: (await res.json() as LoginResponse).access_token,
  });
  await saveOrUpdateUser(user);
  await ctx.reply('You have successfully logged in');
};

export default login;
