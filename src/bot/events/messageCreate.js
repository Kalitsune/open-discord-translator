//InteractionCreate event
const { Events } = require('discord.js');
const { getFlagEmoji } = require("../../helpers/getFlagEmoji.js");
const { splitString } = require("../../helpers/splitString.js");
const { sendMessageAsUser } = require("../../helpers/sendMessageAsUser.js")


let sourceChannelIDs = [];

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // check that ENABLE_REPLICAS is true, if the author is part of the server and if the replica channel is found
        if (process.env.ENABLE_REPLICAS && message.content && !message.channel.isDMBased() && !message.webhookId) {
            // get the replica channels
            const replicaChannels = (await message.client.db.getReplicaChannels()).filter(replica => replica.source_channel_id === message.channel.id);
            for (let replica in replicaChannels) {
                replica = replicaChannels[replica]
                if (replica) {
                    replicaHandler(message, replica);
                }
            }
        }
    }
}

async function replicaHandler(message, replicaChannel) {
    // translate the message
    const translated = await message.client.translate(message.content, replicaChannel.target_language_code);

    // if the source and target channels are equals, check if the message is the same as the original or if it's coming from the same language
    if (replicaChannel.source_channel_id === replicaChannel.target_channel_id && (translated.text === message.content || translated.from === replicaChannel.target_language_code)) return;

    // if possible use webhooks, otherwise use the bot
    // if the channel is a thread the webhook needs to be created in the parent channel
    const destinationChannel = message.client.channels.cache.get(replicaChannel.target_channel_id) || await message.client.channels.fetch(replicaChannel.target_channel_id);

    // check if the channel exists
    if (!destinationChannel) {
        await message.client.db.removeReplicaChannel(replicaChannel.source_channel_id, replicaChannel.target_channel_id, replicaChannel.target_language_code);
        return;
    }
    
    sendMessageAsUser(message.client, destinationChannel, message.member || message.author, translated)
}
