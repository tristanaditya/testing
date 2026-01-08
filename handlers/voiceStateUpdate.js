const store = require("../utils/store");
const { ChannelType, PermissionFlagsBits } = require("discord.js");

module.exports = (client) => {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    try {
      const guild = newState.guild;
      if (!guild) return;

      /* =====================================================
         JOIN CREATE CHANNEL (ANTI SPAM)
      ===================================================== */
      if (
        newState.channelId === store.joinChannelId &&
        oldState.channelId !== store.joinChannelId
      ) {
        const userId = newState.id;
        const now = Date.now();
        const cooldown = store.createCooldown.get(userId) || 0;

        // 10 detik cooldown
        if (now - cooldown < 10_000) {
          await newState.setChannel(null).catch(() => {});
          return;
        }

        store.createCooldown.set(userId, now);

        const vc = await guild.channels.create({
          name: `${newState.member.user.username}'s Room`,
          type: ChannelType.GuildVoice,
          parent: store.categoryId,
          permissionOverwrites: [
            {
              id: guild.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect]
            },
            {
              id: userId,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.MoveMembers,
                PermissionFlagsBits.ManageChannels
              ]
            }
          ]
        });

        // INIT DATA
        store.voiceOwners.set(vc.id, userId);
        store.trusted.set(vc.id, new Set());
        store.blocked.set(vc.id, new Set());
        store.waitingEnabled.set(vc.id, false);
        store.chatEnabled.set(vc.id, true);

        await newState.setChannel(vc).catch(() => {});
      }

      /* =====================================================
         AUTO DELETE EMPTY TEMP VC
      ===================================================== */
      if (
        oldState.channel &&
        oldState.channel.parentId === store.categoryId &&
        oldState.channel.id !== store.joinChannelId
      ) {
        if (oldState.channel.members.size === 0) {
          const vcId = oldState.channel.id;

          // cleanup store
          store.voiceOwners.delete(vcId);
          store.trusted.delete(vcId);
          store.blocked.delete(vcId);
          store.waitingEnabled.delete(vcId);
          store.waitingRoom.delete(vcId);
          store.chatEnabled.delete(vcId);
          store.voiceText?.delete(vcId);

          await oldState.channel.delete().catch(() => {});
        }
      }
    } catch (err) {
      console.error("VOICE STATE ERROR:", err);
    }
  });
};
