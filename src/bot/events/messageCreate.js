//InteractionCreate event
const { Events } = require('discord.js');
const { getFlagEmoji } = require("../../helpers/getFlagEmoji.js");
const { splitString } = require("../../helpers/splitString.js");


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

    // split the message into multiple messages if it's too long
    const messages = splitString(translated.text, 2000);

    // if possible use webhooks, otherwise use the bot
    // if the channel is a thread the webhook needs to be created in the parent channel
    const destinationChannel = message.client.channels.cache.get(replicaChannel.target_channel_id) || await message.client.channels.fetch(replicaChannel.target_channel_id);

    // check if the channel exists
    if (!destinationChannel) {
        await message.client.db.removeReplicaChannel(replicaChannel.source_channel_id, replicaChannel.target_channel_id, replicaChannel.target_language_code);
        return;
    }

    let webhook;
    try {
        // send a message using the user name and pfp using webhooks
        //check if there's a webhook that can be used
        webhook = await destinationChannel.fetchWebhooks().then(webhooks => {
            return webhooks.find(webhook => webhook.owner.id === message.client.user.id);
        });

        //check if the message webhookid is the same as the bot's
        if (webhook && message.webhookId === webhook.id) return;

        if (!webhook) {
            //create a webhook
            webhook = await destinationChannel.createWebhook({
                name: message.client.user.username,
                avatar: message.client.user.displayAvatarURL({format: 'png', dynamic: true}),
                reason: "needed for /send to use webhooks instead of the bot"
            });
        }

        // send the message
        for (let i = 0; i < messages.length; i++) {
            await webhook.send({
                content: messages[i],
                embeds: message.embeds,
                files: message.files,
                components: message.components,
                username: getFlagEmoji(replicaChannel.target_language_code) + " " + (message.member?.nickname || message.author.globalName || message.author.username),
                avatarURL: message.member?.displayAvatarURL({format: 'png', dynamic: true}) || message.user.avatarURL({format: 'png', dynamic: true}),
            });
        }
    } catch (e) {
        try {
            // fallback method
            for (let i = 0; i < messages.length; i++) {
                await destinationChannel.send({
                    content: messages[i],
                    embeds: message.embeds,
                    files: message.files,
                    components: message.components,
                });
            }
        } catch (e) {
            // ignore
        }

    }
}
