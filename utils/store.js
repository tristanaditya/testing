module.exports = {
  categoryId: null,
  joinChannelId: null,
  interfaceChannelId: null,
  adminLogChannelId: null,

  voiceOwners: new Map(),
  trusted: new Map(),
  blocked: new Map(),
  waitingEnabled: new Map(),
  waitingRoom: new Map(),
  chatEnabled: new Map(),
  voiceText: new Map(),
  createCooldown: new Map(),

  cleanup(vcId) {
    this.voiceOwners.delete(vcId);
    this.trusted.delete(vcId);
    this.blocked.delete(vcId);
    this.waitingEnabled.delete(vcId);
    this.waitingRoom.delete(vcId);
    this.chatEnabled.delete(vcId);
    this.voiceText.delete(vcId);
  }
};
