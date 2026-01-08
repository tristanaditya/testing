const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = [
  // ROW 1
  new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("rename").setLabel("NAME").setStyle(ButtonStyle.Secondary).setEmoji("📝"),
    new ButtonBuilder().setCustomId("limit").setLabel("LIMIT").setStyle(ButtonStyle.Secondary).setEmoji("👥"),
    new ButtonBuilder().setCustomId("privacy").setLabel("PRIVACY").setStyle(ButtonStyle.Secondary).setEmoji("🔒"),
    new ButtonBuilder().setCustomId("waiting").setLabel("WAITING R.").setStyle(ButtonStyle.Secondary).setEmoji("⏳"),
    new ButtonBuilder().setCustomId("chat").setLabel("CHAT").setStyle(ButtonStyle.Secondary).setEmoji("💬")
  ),

  // ROW 2
  new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("trust").setLabel("TRUST").setStyle(ButtonStyle.Success).setEmoji("🟢"),
    new ButtonBuilder().setCustomId("untrust").setLabel("UNTRUST").setStyle(ButtonStyle.Danger).setEmoji("🔴"),
    new ButtonBuilder().setCustomId("invite").setLabel("INVITE").setStyle(ButtonStyle.Primary).setEmoji("📨"),
    new ButtonBuilder().setCustomId("kick").setLabel("KICK").setStyle(ButtonStyle.Danger).setEmoji("👢"),
    new ButtonBuilder().setCustomId("region").setLabel("REGION").setStyle(ButtonStyle.Secondary).setEmoji("🌍")
  ),

  // ROW 3
  new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("block").setLabel("BLOCK").setStyle(ButtonStyle.Danger).setEmoji("🚫"),
    new ButtonBuilder().setCustomId("unblock").setLabel("UNBLOCK").setStyle(ButtonStyle.Success).setEmoji("🔓"),
    new ButtonBuilder().setCustomId("claim").setLabel("CLAIM").setStyle(ButtonStyle.Primary).setEmoji("👑"),
    new ButtonBuilder().setCustomId("transfer").setLabel("TRANSFER").setStyle(ButtonStyle.Secondary).setEmoji("🔁"),
    new ButtonBuilder().setCustomId("delete").setLabel("DELETE").setStyle(ButtonStyle.Danger).setEmoji("🗑")
  )
];
