import { Context } from 'grammy';
import * as moment from 'moment/moment';
import fetch from 'node-fetch';

import { getUser } from './db';
import { DateResponse } from './types';

const onMessage = async (ctx: Context) => {
  const user = await getUser(ctx.from.id);
  if (!user) {
    await ctx.reply('You are not registered');
    return;
  }

  const dateString = moment().format('MM-DD-YYYY');

  const dateRes = await fetch(`${user.server}/api/date?date=${dateString}`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.5',
      'content-type': 'application/json;charset=UTF-8',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sec-gpc': '1',
      Referer: `${user.server}/auth/`,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      authorization: `Bearer ${user.token}`,
    },
    body: null,
    method: 'GET',
  }).then((r) => r.json()) as DateResponse;

  const body = {
    data: `${dateRes.day.data}\n\n${ctx.message.text}`,
    is_date: true,
    title: dateString,
    uuid: dateRes.day.uuid,
  };

  const saveRes = await fetch(`${user.server}/api/save_day`, {
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.5',
      'content-type': 'application/json;charset=UTF-8',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'sec-gpc': '1',
      Referer: `${user.server}/auth/`,
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify(body),
    method: 'PUT',
  });

  if (saveRes.status !== 200) {
    await ctx.reply('Error while saving data');
  } else {
    await ctx.reply('👍');
  }
};

export default onMessage;
