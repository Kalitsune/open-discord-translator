// replicas.js
// the replicas command has 3 subcommands: add, remove, and list
// they are exclusively restricted to those with the manage channels permission
// the add subcommand adds a channel to be replicated
// the remove subcommand removes a channel from the replication list
// the list subcommand lists all the channels that are being replicated

const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js');

const { getKeyLocalizations, getLocalization } = require('../../../localizations/localizations.js');
const { getFlagEmoji, splitString } = require('../../../utils');

module.exports = {
    init(client) {
        //get the country codes
        let languages = client.languages.map((lang) => {return {name: lang.name, value: lang.code}});
        // edit the command
        const command = client.commands.get('replicas');
        // transform the sources/targets into choices {name, value}
        command.data.options[0].options[2].choices = languages
        command.data.options[1].options[2].choices = languages
    },
    data: new SlashCommandBuilder()
        .setName('replicas').setDescription("Manage replicas.")
        .setNameLocalizations(getKeyLocalizations('commands:replicas.name'))
        .setDescriptionLocalizations(getKeyLocalizations('commands:replicas.description'))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(subcommand =>
            subcommand.setName('add').setDescription("Add a channel to be replicated.")
                .setNameLocalizations(getKeyLocalizations('commands:replicas.sub.add.name'))
                .setDescriptionLocalizations(getKeyLocalizations('commands:replicas.sub.add.description'))
                .addChannelOption(option =>
                    option.setName('source').setDescription("The channel whose messages will be translated.")
                        .setNameLocalizations(getKeyLocalizations('commands:replicas.options.source.name'))
                        .setDescriptionLocalizations(getKeyLocalizations('commands:replicas.options.source.description'))
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('target').setDescription("The channel where the translated messages should be send.")
                        .setNameLocalizations(getKeyLocalizations('commands:replicas.options.target.name'))
                        .setDescriptionLocalizations(getKeyLocalizations('commands:replicas.options.target.description'))
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('language').setDescription("The language to translate to.")
                        .setNameLocalizations(getKeyLocalizations('commands:replicas.options.language.name'))
                        .setDescriptionLocalizations(getKeyLocalizations('commands:replicas.options.language.description'))
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove').setDescription("Remove a replica.")
                .setNameLocalizations(getKeyLocalizations('commands:replicas.sub.remove.name'))
                .setDescriptionLocalizations(getKeyLocalizations('commands:replicas.sub.remove.description'))
                .addChannelOption(option =>
                    option.setName('source').setDescription("The channel whose messages will be translated.")
                        .setNameLocalizations(getKeyLocalizations('commands:replicas.options.source.name'))
                        .setDescriptionLocalizations(getKeyLocalizations('commands:replicas.options.source.description'))
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
                .addChannelOption(option =>
                    option.setName('target').setDescription("The channel where the translated messages should be send.")
                        .setNameLocalizations(getKeyLocalizations('commands:replicas.options.target.name'))
                        .setDescriptionLocalizations(getKeyLocalizations('commands:replicas.options.target.description'))
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('language').setDescription("The language to translate to.")
                        .setNameLocalizations(getKeyLocalizations('commands:replicas.options.language.name'))
                        .setDescriptionLocalizations(getKeyLocalizations('commands:replicas.options.language.description'))
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('list').setDescription("List all the replicas.")
                .setNameLocalizations(getKeyLocalizations('commands:replicas.sub.list.name'))
                .setDescriptionLocalizations(getKeyLocalizations('commands:replicas.sub.list.description'))),
    async execute(interaction) {
        // run the appropriate function based on the subcommand
        switch (interaction.options.getSubcommand()) {
            case 'add':
                await add(interaction);
                break;
            case 'remove':
                await remove(interaction);
                break;
            case 'list':
                await list(interaction);
                break;
        }
    }
}

async function add(interaction) {
    // get the source and target channels
    const sourceChannel = interaction.options.getChannel('source');
    const targetChannel = interaction.options.getChannel('target');
    // get the language code
    const languageCode = interaction.options.getString('language');

    // check if the source and target channels are in the same guild
    if (sourceChannel.guild.id !== targetChannel.guild.id) {
        const responseEmbed = new EmbedBuilder()
            .setColor(process.env.ACCENT_COLOR)
            .setDescription(getLocalization("commands:replicas.sub.add.errors.differentGuilds", interaction.locale));
        return await interaction.reply({embeds: [responseEmbed], ephemeral: true});
    }

    // register the replica channel in the db
    try {
        await interaction.client.db.addReplicaChannel(sourceChannel.guild.id, sourceChannel.id, targetChannel.id, languageCode);
    } catch (e) {
        // catch sqlite3 primary key constraint errors
        if (e.code === 'SQLITE_CONSTRAINT') {
            // reply to the interaction
            const responseEmbed = new EmbedBuilder()
                .setColor(process.env.ACCENT_COLOR)
                .setDescription(getLocalization("commands:replicas.sub.add.errors.alreadyExists", interaction.locale, {
                    name: `${interaction.command.name} ${module.exports.data.options[2].name}`,
                    id: interaction.command.id
                }));
            return await interaction.reply({embeds: [responseEmbed], ephemeral: true});
        }
    }

    // reply to the interaction
    const responseEmbed = new EmbedBuilder()
        .setColor(process.env.ACCENT_COLOR)
        .setDescription(getLocalization("commands:replicas.sub.add.success", interaction.locale, {
                source: sourceChannel.id,
                target: targetChannel.id,
                language: getFlagEmoji(languageCode)
            }));
    return await interaction.reply({embeds: [responseEmbed], ephemeral: true});
}

async function list(interaction) {
    // get the replicas
    const replicas = await interaction.client.db.getGuildReplicaChannels(interaction.guild.id);

    // check if there are any replicas
    if (replicas.length === 0) {
        // reply to the interaction
        const responseEmbed = new EmbedBuilder()
            .setColor(process.env.ACCENT_COLOR)
            .setDescription(getLocalization("commands:replicas.sub.list.errors.noReplicas", interaction.locale, {
                name: `${interaction.command.name} ${module.exports.data.options[0].name}`,
                id: interaction.command.id
            }));
        return await interaction.reply({embeds: [responseEmbed], ephemeral: true});
    }

    // build the description

    let description = "";
    let i = 1;
    // add the replicas to the embed
    for (const replica of replicas) {
        // get the source and target channels
        const sourceChannel = interaction.client.channels.cache.get(replica.source_channel_id);
        const targetChannel = interaction.client.channels.cache.get(replica.target_channel_id);

        // add a formatted text to the description
        description += `${i}.  \uD83C\uDF10 <#${sourceChannel.id}> → ${getFlagEmoji(replica.target_language_code)} <#${targetChannel.id}>\n`

        // increment the number
        i++;
    }

    // split the description into chunks
    const descriptionChunks = splitString(description, 2000);

    // create the embed
    let responseEmbeds = [];
    //first embed
    responseEmbeds.push(new EmbedBuilder()
        .setColor(process.env.ACCENT_COLOR)
        .setTitle(getLocalization("commands:replicas.sub.list.title", interaction.locale))
        .setDescription(descriptionChunks[0]));
    // for every chunk after the first one
    for (let i = 1; i < descriptionChunks.length; i++) {
        // add a field to the embed
        responseEmbeds.push(getLocalization("commands:replicas.sub.list.title", interaction.locale), descriptionChunks[i]);
    }

    // reply to the interaction
    return await interaction.reply({embeds: responseEmbeds, ephemeral: true});
    // ^^^
    // could technically break if the number of embeds is greater than 5, but it's starting to get ridiculous at that point
}


async function remove(interaction) {
    // get the source and target channels
    const sourceChannel = interaction.options.getChannel('source');
    const targetChannel = interaction.options.getChannel('target');
    // get the language code
    const languageCode = interaction.options.getString('language');

    //check if the replica exists
    if(!await interaction.client.db.getReplicaChannel(sourceChannel.id, targetChannel.id, languageCode)) {
        // reply to the interaction
        const responseEmbed = new EmbedBuilder()
            .setColor(process.env.ACCENT_COLOR)
            .setDescription(getLocalization("commands:replicas.sub.remove.errors.notFound", interaction.locale, {
                name: `${interaction.command.name} ${module.exports.data.options[2].name}`,
                id: interaction.command.id
            }));
        return await interaction.reply({embeds: [responseEmbed], ephemeral: true});
    }

    // remove the replica channel from the db
    await interaction.client.db.removeReplicaChannel(sourceChannel.id, targetChannel.id, languageCode);

    // reply to the interaction
    const responseEmbed = new EmbedBuilder()
        .setColor(process.env.ACCENT_COLOR)
        .setDescription(getLocalization("commands:replicas.sub.remove.success", interaction.locale, {
            source: sourceChannel.id,
            target: targetChannel.id,
            language: getFlagEmoji(languageCode)
        }));
    return await interaction.reply({embeds: [responseEmbed], ephemeral: true});
}
