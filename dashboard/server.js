
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const configPath = '../bot/config.json';
const broadcastPath = '../bot/broadcast.json';

if (!fs.existsSync(configPath)) fs.writeFileSync(configPath, JSON.stringify({ verifyButton: true, zoneButton: true }, null, 2));
if (!fs.existsSync(broadcastPath)) fs.writeFileSync(broadcastPath, JSON.stringify({ enabled: false }, null, 2));

app.get('/api/config', (_, res) => res.json(JSON.parse(fs.readFileSync(configPath))));
app.post('/api/toggle', (req, res) => {
  const data = JSON.parse(fs.readFileSync(configPath));
  const key = req.body.key;
  data[key] = !data[key];
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
  res.json(data);
});

app.post('/api/broadcast', (req, res) => {
  fs.writeFileSync(broadcastPath, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

app.listen(3000, () => console.log('🌐 Dashboard running on http://localhost:3000'));
