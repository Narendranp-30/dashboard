const axios = require('axios');

const TELEGRAM_BOT_TOKEN = '7802054636:AAG0Erm8WFVsBT5Oa1XMPvvmD9cJsOpPTVA';
const TELEGRAM_CHAT_ID = '1315295046'; // Put the chat ID you got from step 1

async function testTelegram() {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: '🔔 Test Alert: Blood Donation System Test Message',
        parse_mode: 'Markdown'
      }
    );
    console.log('Message sent successfully:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testTelegram(); 