//InteractionCreate event
const { Events } = require('discord.js');
const { sendMessageAsUser } = require("../../helpers/sendMessageAsUser.js")

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // check that ENABLE_REPLICAS is true, if the author is part of the server and if the replica channel is found
        if (process.env.ENABLE_REPLICAS) {
            if ((message.content || message.attachments) && !message.channel.isDMBased() && !message.webhookId) {
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
}

async function replicaHandler(message, replicaChannel) {
    let translated = {text: ""}
    if (message.content) {
        // translate the message
        translated = await message.client.translate(message.content, replicaChannel.target_language_code);
        translated.to = undefined
    }

    // if the source and target channels are equals, check if the message is the same as the original or if it's coming from the same language
    if (replicaChannel.source_channel_id === replicaChannel.target_channel_id && (translated.text === message.content || translated.from === replicaChannel.target_language_code)) return;
    else translated.text += `[。](<${message.url}>)`; //adds a discrete character at the end of each messages referencing the original message

    // if possible use webhooks, otherwise use the bot
    // if the channel is a thread the webhook needs to be created in the parent channel
    const destinationChannel = message.client.channels.cache.get(replicaChannel.target_channel_id) || await message.client.channels.fetch(replicaChannel.target_channel_id);

    // check if the channel exists
    if (!destinationChannel) {
        await message.client.db.removeReplicaChannel(replicaChannel.source_channel_id, replicaChannel.target_channel_id, replicaChannel.target_language_code);
        return;
    }
    const files = replicaChannel.source_channel_id === replicaChannel.target_channel_id ? null : Array.from(message.attachments?.values())
    sendMessageAsUser(message.client, destinationChannel, message.member || message.author, translated, files)
}
