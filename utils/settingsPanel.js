const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
new ButtonBuilder().setCustomId("waiting").setLabel("🕒 Waiting Room").setStyle(ButtonStyle.Secondary),
new ButtonBuilder().setCustomId("chat").setLabel("💬 Voice Chat").setStyle(ButtonStyle.Secondary)

module.exports = [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("rename").setLabel("✏ Rename").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("limit").setLabel("👥 Limit").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("privacy").setLabel("🔐 Privacy").setStyle(ButtonStyle.Secondary)
  ),

  new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("waiting").setLabel("🕒 Waiting").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("chat").setLabel("💬 Chat").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("region").setLabel("🌍 Region").setStyle(ButtonStyle.Secondary)
  ),

  new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("trust").setLabel("✅ Trust").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("untrust").setLabel("❌ Untrust").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("block").setLabel("⛔ Block").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("unblock").setLabel("♻ Unblock").setStyle(ButtonStyle.Success)
  ),

  new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("invite").setLabel("📨 Invite").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("kick").setLabel("👢 Kick").setStyle(ButtonStyle.Danger)
  ),

  new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("claim").setLabel("👑 Claim").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("transfer").setLabel("🔁 Transfer").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("delete").setLabel("🗑 Delete").setStyle(ButtonStyle.Danger)
  )
];
