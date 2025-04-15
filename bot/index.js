
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

let config = JSON.parse(fs.readFileSync('./config.json'));
let broadcast = {};

fs.watchFile('./config.json', () => {
  config = JSON.parse(fs.readFileSync('./config.json'));
  console.log('[🔄] config.json updated!');
});

fs.watchFile('./broadcast.json', () => {
  broadcast = JSON.parse(fs.readFileSync('./broadcast.json'));
  if (broadcast.enabled && broadcast.message && broadcast.channelId) {
    const channel = client.channels.cache.get(broadcast.channelId);
    if (channel) {
      const embed = {
        title: broadcast.title || '📢 ประกาศ',
        description: broadcast.message,
        color: 0x3498db,
      };
      channel.send({ embeds: [embed] });
      console.log(`[📢] Broadcast sent to #${broadcast.channelId}`);
      fs.writeFileSync('./broadcast.json', JSON.stringify({ enabled: false }, null, 2));
    }
  }
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
