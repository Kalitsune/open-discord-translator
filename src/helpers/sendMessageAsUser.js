const { getFlagEmoji } = require("./getFlagEmoji.js")
const { splitString } = require("./splitString.js")
const { ChannelType } = require("discord-api-types/v10")

async function sendMessageAsUser(client, channel, member, translation) {
  const messages = splitString(translation.text, 2000);

  // if possible use webhooks, otherwise use the bot
  // if the channel is a thread the webhook needs to be created in the parent channel
  const isThread = channel.type === ChannelType.PublicThread || channel.type === ChannelType.PrivateThread;
  const webhookChannel = isThread ? channel.parent : channel;
  let webhook;
  try {
      // send a message using the user name and pfp using webhooks
      //check if there's a webhook that can be used
      webhook = await webhookChannel.fetchWebhooks().then(webhooks => {
          return webhooks.find(webhook => webhook.owner.id ===client.user.id);
      });

      if (!webhook) {
          //create a webhook
          webhook = await webhookChannel.createWebhook({
              name: client.user.username,
              avatar: client.user.displayAvatarURL({format: 'png', dynamic: true}),
              reason: "needed for /send to use webhooks instead of the bot"
          });
      }

  } catch (e) {
      // fallback method
      await reply(messages[0]);
      // loop through the other messages (if any) and send them as follow ups
      for (let i = 1; i < messages.length; i++) {
          await followUp(messages[i]);
      }
      return;
  }
    
  // send the message
  let sentMessages = [];
  for (let i = 0; i < messages.length; i++) {
      sentMessages.push(await webhook.send({
          content: messages[i],
          username: getFlagEmoji(translation.to) + " " + (member?.nickname || member?.user?.globalName || member?.globalName || member?.username),
          avatarURL: member.displayAvatarURL({format: 'png', dynamic: true}),
          threadId: isThread ? channel.id : null
      }));
  }

  return {webhook, sentMessages}
}

module.exports = {sendMessageAsUser};
