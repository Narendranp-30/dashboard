const { testTelegramAlert } = require('./services/telegramService');

async function runTest() {
  try {
    console.log('Sending test alerts...');
    await testTelegramAlert();
    console.log('Test alerts sent successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTest(); 