const { EmbedBuilder } = require("discord.js");
const store = require("./store");

module.exports = async function log(guild, title, description) {
  try {
    const logChannel = guild.channels.cache.get(store.adminLogChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
      .setTitle("📜 TempVoice Log")
      .setColor(0x2f3136)
      .addFields(
        { name: title, value: description }
      )
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  } catch (e) {}
};
