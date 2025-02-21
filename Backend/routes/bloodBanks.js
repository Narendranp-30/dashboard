const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;

router.get('/data', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, '../../public/data.json');
    const data = await fs.readFile(dataPath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading blood bank data:', error);
    res.status(500).json({ error: 'Failed to load blood bank data' });
  }
});

module.exports = router; 