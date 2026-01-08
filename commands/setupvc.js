const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder
} = require("discord.js");

const store = require("../utils/store");
const panel = require("../utils/panel");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setupvc")
    .setDescription("Setup Temp Voice system"),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;

    // Prevent double setup
    if (store.joinChannelId) {
      return interaction.editReply("❌ TempVoice sudah pernah disetup.");
    }

    /* ================= CATEGORY ================= */
    const category = await guild.channels.create({
      name: "TEMP VOICE",
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: [PermissionFlagsBits.ViewChannel]
        }
      ]
    });

    /* ================= JOIN CHANNEL ================= */
    const joinChannel = await guild.channels.create({
      name: "➕ Create Voice",
      type: ChannelType.GuildVoice,
      parent: category.id,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.Connect
          ]
        }
      ]
    });

    /* ================= INTERFACE ================= */
    const interfaceChannel = await guild.channels.create({
      name: "interface",
      type: ChannelType.GuildText,
      parent: category.id,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: [PermissionFlagsBits.ViewChannel]
        }
      ]
    });

    /* ================= ADMIN LOG ================= */
    const logChannel = await guild.channels.create({
      name: "tempvoice-log",
      type: ChannelType.GuildText,
      parent: category.id,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel]
        }
      ]
    });

    /* ================= SAVE STORE ================= */
    store.categoryId = category.id;
    store.joinChannelId = joinChannel.id;
    store.interfaceChannelId = interfaceChannel.id;
    store.adminLogChannelId = logChannel.id;

    /* ================= SEND PANEL ================= */
    const embed = new EmbedBuilder()
      .setTitle("🎧 TempVoice Control Panel")
      .setDescription(
        "Masuk ke voice lalu gunakan tombol di bawah untuk mengatur room kamu."
      )
      .setColor(0x2f3136);

    await interfaceChannel.send({
      embeds: [embed],
      components: panel
    });

    await interaction.editReply("✅ TempVoice berhasil dibuat!");
  }
};
