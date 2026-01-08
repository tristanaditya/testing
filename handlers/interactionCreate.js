const store = require("../utils/store");
const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  UserSelectMenuBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

/* ================= UTIL ================= */
function getSet(map, key) {
  if (!map.has(key)) map.set(key, new Set());
  return map.get(key);
}

function getVC(interaction) {
  return interaction.member?.voice?.channel || null;
}

function isAllowed(interaction, vc) {
  const owner = store.voiceOwners.get(vc.id);
  const trusted = getSet(store.trusted, vc.id);
  return owner === interaction.user.id || trusted.has(interaction.user.id);
}

/* SAFE REPLY (ANTI INTERACTION FAILED) */
async function reply(interaction, data) {
  try {
    if (interaction.deferred || interaction.replied) {
      return await interaction.editReply(data);
    } else {
      return await interaction.reply(data);
    }
  } catch (e) {}
}

/* ================= MAIN ================= */
module.exports = (client) => {
  client.on("interactionCreate", async (interaction) => {
    try {

      /* ================= SLASH ================= */
      if (interaction.isChatInputCommand()) {
        const cmd = client.commands.get(interaction.commandName);
        if (cmd) return await cmd.execute(interaction);
        return;
      }

      /* ================= BUTTON ================= */
      if (interaction.isButton()) {
        const vc = getVC(interaction);
        if (!vc)
          return reply(interaction,{ content:"❌ Kamu harus di voice", flags:64 });

        if (!isAllowed(interaction, vc))
          return reply(interaction,{ content:"❌ Kamu bukan owner / trusted", flags:64 });

        if (interaction.customId === "waiting") {
          const state = store.waitingEnabled.get(vc.id) || false;
          store.waitingEnabled.set(vc.id, !state);
          return reply(interaction,{
            content: state ? "🟢 Waiting dimatikan" : "🕒 Waiting diaktifkan",
            flags:64
          });
        }

        if (interaction.customId === "chat") {
          const enabled = store.chatEnabled.get(vc.id) ?? true;
          store.chatEnabled.set(vc.id, !enabled);
          await vc.permissionOverwrites.edit(interaction.guild.id,{ SendMessages: !enabled }).catch(()=>{});
          return reply(interaction,{
            content: enabled ? "🔇 Chat dimatikan" : "💬 Chat diaktifkan",
            flags:64
          });
        }

        if (["rename","limit"].includes(interaction.customId)) {
          const modal = new ModalBuilder()
            .setCustomId(interaction.customId+"_modal")
            .setTitle(interaction.customId==="rename"?"Rename Room":"Room Limit")
            .addComponents(
              new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                  .setCustomId("value")
                  .setLabel("Masukkan value")
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
              )
            );
          return interaction.showModal(modal);
        }

        if (interaction.customId === "privacy") {
          return reply(interaction,{
            components:[new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId("privacy_select")
                .addOptions(
                  {label:"Lock",value:"lock"},
                  {label:"Unlock",value:"unlock"},
                  {label:"Invisible",value:"hide"},
                  {label:"Visible",value:"show"}
                )
            )],
            flags:64
          });
        }

        if (interaction.customId === "region") {
          return reply(interaction,{
            components:[new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId("region_select")
                .addOptions(
                  {label:"Singapore",value:"singapore"},
                  {label:"Japan",value:"japan"},
                  {label:"US Central",value:"us-central"}
                )
            )],
            flags:64
          });
        }

        if (["trust","untrust","block","unblock","invite","kick","transfer"].includes(interaction.customId)) {
          return reply(interaction,{
            components:[new ActionRowBuilder().addComponents(
              new UserSelectMenuBuilder().setCustomId("select_"+interaction.customId)
            )],
            flags:64
          });
        }

        if (interaction.customId === "claim") {
          store.voiceOwners.set(vc.id, interaction.user.id);
          return reply(interaction,{ content:"👑 Kamu sekarang owner", flags:64 });
        }

        if (interaction.customId === "delete") {
          await vc.delete().catch(()=>{});
          return reply(interaction,{ content:"🗑 Room dihapus", flags:64 });
        }
      }

      /* ================= USER SELECT ================= */
      if (interaction.isUserSelectMenu()) {

        const vc = getVC(interaction);
        const targetId = interaction.values[0];

        // BALAS CEPAT biar gak timeout
        await interaction.deferReply({ flags:64 });

        const target = await interaction.guild.members.fetch(targetId).catch(() => null);

        if (!vc || !target) return reply(interaction,{ content:"❌ User tidak ditemukan", flags:64 });
        if (!isAllowed(interaction, vc)) return reply(interaction,{ content:"❌ Kamu bukan owner / trusted", flags:64 });

        const ownerId = store.voiceOwners.get(vc.id);

        if (interaction.customId === "select_trust") {
          getSet(store.trusted, vc.id).add(target.id);
          return reply(interaction,{ content:"✅ User ditambahkan ke trusted", flags:64 });
        }

        if (interaction.customId === "select_untrust") {
          getSet(store.trusted, vc.id).delete(target.id);
          return reply(interaction,{ content:"✅ User dihapus dari trusted", flags:64 });
        }

        if (interaction.customId === "select_block") {
          await vc.permissionOverwrites.edit(target.id,{ Connect:false }).catch(()=>{});
          if (vc.members.has(target.id)) await target.voice.setChannel(null).catch(()=>{});
          getSet(store.blocked, vc.id).add(target.id);
          return reply(interaction,{ content:"⛔ User diblock", flags:64 });
        }

       if (interaction.customId === "select_unblock") {
            getSet(store.blocked, vc.id).delete(target.id);

            // Remove permission overwrite kalau ada
            await vc.permissionOverwrites.delete(target.id).catch(() => {});

            return interaction.editReply({
                content: `🔓 ${target.user.tag} berhasil di-unblock`
            });
        }


        if (interaction.customId === "select_invite") {
          await target.send(`🔗 https://discord.com/channels/${interaction.guild.id}/${vc.id}`).catch(()=>{});
          return reply(interaction,{ content:"📨 Invite dikirim", flags:64 });
        }

        if (interaction.customId === "select_transfer") {
          store.voiceOwners.set(vc.id, target.id);
          return reply(interaction,{ content:`👑 Owner dipindah ke ${target.user.tag}`, flags:64 });
        }

        if (interaction.customId === "select_kick") {
          if (!vc.members.has(target.id))
            return reply(interaction,{ content:"❌ User tidak ada di room", flags:64 });
          if (target.id === ownerId)
            return reply(interaction,{ content:"❌ Tidak bisa kick owner", flags:64 });
          await target.voice.setChannel(null).catch(()=>{});
          return reply(interaction,{ content:`👢 ${target.user.tag} berhasil di kick`, flags:64 });
        }
      }

      /* ================= STRING SELECT ================= */
      if (interaction.isStringSelectMenu()) {
        const vc = getVC(interaction);
        if (!vc) return interaction.update({ components:[] });

        const v = interaction.values[0];
        if (interaction.customId==="privacy_select") {
          if (v==="lock") await vc.permissionOverwrites.edit(interaction.guild.id,{Connect:false});
          if (v==="unlock") await vc.permissionOverwrites.edit(interaction.guild.id,{Connect:true});
          if (v==="hide") await vc.permissionOverwrites.edit(interaction.guild.id,{ViewChannel:false});
          if (v==="show") await vc.permissionOverwrites.edit(interaction.guild.id,{ViewChannel:true});
        }
        if (interaction.customId==="region_select") await vc.setRTCRegion(v).catch(()=>{});

        return interaction.update({ content:"✅ Updated", components:[] });
      }

      /* ================= MODAL ================= */
      if (interaction.isModalSubmit()) {
        await interaction.deferReply({ flags:64 });
        const vc = getVC(interaction);
        if (!vc) return;

        const value = interaction.fields.getTextInputValue("value");
        if (interaction.customId==="rename_modal") await vc.setName(value).catch(()=>{});
        if (interaction.customId==="limit_modal") await vc.setUserLimit(parseInt(value)||0).catch(()=>{});

        return reply(interaction,{ content:"✅ Updated", flags:64 });
      }

    } catch (err) {
      console.error("INTERACTION ERROR:", err);
    }
  });
};
