require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

/* ===== LOAD SLASH COMMANDS ===== */
for (const file of fs.readdirSync("./commands").filter(f => f.endsWith(".js"))) {
  const cmd = require(`./commands/${file}`);

  if (!cmd.data || !cmd.execute) {
    console.log(`❌ Invalid command: ${file}`);
    continue;
  }

  client.commands.set(cmd.data.name, cmd);
  console.log(`✅ Loaded command: ${cmd.data.name}`);
}

/* ===== EVENTS ===== */
require("./handlers/interactionCreate")(client);
require("./handlers/voiceStateUpdate")(client);

client.once("clientReady", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);
