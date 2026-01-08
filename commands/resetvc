const { SlashCommandBuilder, ChannelType } = require("discord.js");
const store = require("../utils/store");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resetvc")
    .setDescription("Reset semua Temp Voice Channel"),

  async execute(interaction) {
    try {
      const guild = interaction.guild;

      if (!store.categoryId)
        return interaction.reply({ content: "❌ TempVoice belum disetup.", flags: 64 });

      const category = guild.channels.cache.get(store.categoryId);
      if (!category)
        return interaction.reply({ content: "❌ Category TempVoice tidak ditemukan.", flags: 64 });

      let deleted = 0;

      /* ================= DELETE CHILD CHANNELS ================= */
      const children = guild.channels.cache.filter(c => c.parentId === category.id);

      for (const ch of children.values()) {
        await ch.delete().catch(() => {});
        deleted++;
      }

      /* ================= DELETE CATEGORY ================= */
      await category.delete().catch(() => {});

      /* ================= CLEAR MEMORY ================= */
      store.voiceOwners.clear();
      store.trusted.clear();
      store.blocked.clear();
      store.waitingEnabled.clear();
      store.waitingRoom.clear();
      store.chatEnabled.clear();
      store.voiceText?.clear();
      store.createCooldown?.clear();

      store.joinChannelId = null;
      store.interfaceChannelId = null;
      store.categoryId = null;
      store.adminLogChannelId = null;

      return interaction.reply({
        content: `✅ Reset selesai. ${deleted} channel dihapus.`,
        flags: 64
      });

    } catch (err) {
      console.error("RESET ERROR:", err);
      if (!interaction.replied)
        return interaction.reply({ content: "❌ Gagal reset TempVoice.", flags: 64 });
    }
  }
};
