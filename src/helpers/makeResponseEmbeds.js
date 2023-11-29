const {EmbedBuilder} = require("discord.js")
const {getFlagEmoji} = require("./getFlagEmoji.js")
const {splitString}  = require("./splitString.js")
const {getLocalization} = require("../localizations/localizations")

function makeResponseEmbeds (locale, from, to, text) {
    // make the title
    const title = getLocalization("commands:translate.success", locale ,{
        from: getFlagEmoji(from),
        to: getFlagEmoji(to)
    });

    // split the text so that it is not too long
    const chunks = splitString(text, 4096);

    // make the embeds
    let responseEmbeds = []
    for (let i = 0; i < chunks.length; i++) {
        responseEmbeds[i] = new EmbedBuilder().setColor(process.env.ACCENT_COLOR)
            .setDescription(chunks[i]);
    }

    // set the title of the first embed
    responseEmbeds[0].setTitle(title);

    return responseEmbeds;
}

module.exports = {makeResponseEmbeds}
