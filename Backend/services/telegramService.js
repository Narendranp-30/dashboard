const axios = require('axios');

const TELEGRAM_BOT_TOKEN = '7802054636:AAG0Erm8WFVsBT5Oa1XMPvvmD9cJsOpPTVA';
const TELEGRAM_CHAT_ID = '1315295046'; // Your chat ID from the test response

const sendTelegramAlert = async (donor, requester) => {
  try {
    // First alert - Initial Emergency
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: '🚨 *EMERGENCY BLOOD REQUEST ALERT* 🚨\n\n*URGENT RESPONSE NEEDED*',
        parse_mode: 'Markdown',
        disable_notification: false
      }
    );

    // Wait 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Second alert - Details
    const detailMessage = `
⚠️ *URGENT BLOOD REQUEST DETAILS* ⚠️

*Requester Details:*
🩸 Blood Group: ${requester.bloodGroup}
📍 Location: ${requester.district}
👤 Name: ${requester.name}
📞 Contact: ${requester.contact}

*Non-Responding Donor:*
👤 Name: ${donor.name}
📞 Contact: ${donor.contact}
📧 Email: ${donor.email}

⏰ Request Time: ${new Date().toLocaleString()}`;

    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: detailMessage,
        parse_mode: 'Markdown',
        disable_notification: false
      }
    );

    // Third alert - First Reminder
    await new Promise(resolve => setTimeout(resolve, 1000));
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: '🔔 *FIRST REMINDER*\nPlease respond to this urgent blood request!',
        parse_mode: 'Markdown',
        disable_notification: false
      }
    );

    // Fourth alert - Second Reminder
    await new Promise(resolve => setTimeout(resolve, 1000));
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: '⚡ *SECOND REMINDER*\nImmediate response required for blood donation!',
        parse_mode: 'Markdown',
        disable_notification: false
      }
    );
    // Fourth alert - Second Reminder
    await new Promise(resolve => setTimeout(resolve, 1000));
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: '⚡ *Third REMINDER*\nImmediate response required for blood donation!',
        parse_mode: 'Markdown',
        disable_notification: false
      }
    );
    // Fourth alert - Second Reminder
    await new Promise(resolve => setTimeout(resolve, 1000));
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: '⚡ *Forth REMINDER*\nImmediate response required for blood donation!',
        parse_mode: 'Markdown',
        disable_notification: false
      }
    );
    // Fourth alert - Second Reminder
    await new Promise(resolve => setTimeout(resolve, 1000));
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: '⚡ *Fifth REMINDER*\nImmediate response required for blood donation!',
        parse_mode: 'Markdown',
        disable_notification: false
      }
    );

    // Fifth alert - Final Warning
    await new Promise(resolve => setTimeout(resolve, 1000));
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: '🚨 *FINAL ALERT*\nThis is your last reminder to respond to the blood request!\n\n*IMMEDIATE ACTION REQUIRED*',
        parse_mode: 'Markdown',
        disable_notification: false
      }
    );

    return true;
  } catch (error) {
    console.error('Telegram Alert Error:', error.response?.data || error);
    throw error;
  }
};

// Test function
const testTelegramAlert = async () => {
  try {
    const testDonor = {
      name: 'Test Donor',
      contact: '1234567890',
      email: 'test@example.com'
    };

    const testRequester = {
      name: 'Test Requester',
      bloodGroup: 'O+',
      district: 'Test District',
      contact: '9876543210'
    };

    await sendTelegramAlert(testDonor, testRequester);
    console.log('Test alerts sent successfully');
    return true;
  } catch (error) {
    console.error('Test Alert Error:', error);
    throw error;
  }
};

module.exports = { sendTelegramAlert, testTelegramAlert }; 