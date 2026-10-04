// Срабатывает автоматически после каждой заявки с формы и шлёт её в Telegram.
// Токен и chat id берутся из переменных окружения Netlify, в коде их НЕТ.
exports.handler = async (event) => {
  try {
    const d = JSON.parse(event.body).payload.data || {};
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chat) { console.log('Нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID'); return { statusCode: 200 }; }
    const t = (v) => String(v || '-').slice(0, 300);
    const text = [
      'Новая заявка в Sharga Gaming',
      'Ник: ' + t(d.nick),
      'Позиция: ' + t(d.role),
      'MMR: ' + t(d.mmr),
      'Telegram: ' + t(d.contact),
      'Профиль: ' + t(d.profile),
      'О себе: ' + t(d.about)
    ].join('\n');
    const r = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text })
    });
    console.log('Telegram ответил:', r.status);
  } catch (e) { console.log('Ошибка:', e.message); }
  return { statusCode: 200 };
};
