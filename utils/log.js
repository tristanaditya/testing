const store = require("./store");

module.exports = async (guild, text) => {
  const ch = guild.channels.cache.get(store.adminLogChannelId);
  if (ch) ch.send(`📜 ${text}`).catch(()=>{});
};
