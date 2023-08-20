// sqlite driver for the database
const sqlite = require('sqlite3');
const util = require("node:util")

const { errBadRequest } = require('../../errors');

let database = null;
let databaseRun = null;
let databaseAll = null;
module.exports = {
    async init() {
        //check if SQLITE_PATH is set
        if (process.env.SQLITE_PATH) {
            // load the database
            database = new sqlite.Database(process.env.SQLITE_PATH);
        } else {
            // use in memory database
            console.warn('[WARNING] SQLITE_PATH not set, the database will be wiped on restart');
            database = new sqlite.Database(':memory:');
        }

        // define the database functions do be async
        databaseRun = util.promisify(database.run.bind(database));
        databaseAll = util.promisify(database.all.bind(database));

        // create the tables if they don't exist

        // create the replica channels table
        return databaseRun(`CREATE TABLE IF NOT EXISTS replica_channels (
            guild_id TEXT NOT NULL,
            source_channel_id TEXT NOT NULL,
            target_channel_id TEXT NOT NULL,
            target_language_code TEXT NOT NULL,
            PRIMARY KEY (guild_id, source_channel_id, target_channel_id, target_language_code)
        )`);
    },
    async addReplicaChannel(guildId, sourceChannelId, targetChannelId, targetLanguageCode) {
        // check if any of the arguments are invalid
        if (!guildId || !sourceChannelId || !targetChannelId || !targetLanguageCode) throw new errBadRequest('Missing argument(s)');

        // add a channel to be replicated in another language
        return databaseRun(`INSERT INTO replica_channels (guild_id, source_channel_id, target_channel_id, target_language_code) VALUES (?, ?, ?, ?)`, [guildId, sourceChannelId, targetChannelId, targetLanguageCode]);
    },
    async getReplicaChannels() {
        // get all the channels to be replicated
        return await databaseAll(`SELECT * FROM replica_channels`);
    },
    async getGuildReplicaChannels(guildId) {
        // get all the channels to be replicated in a guild
        return await databaseAll(`SELECT * FROM replica_channels WHERE guild_id = ?`, [guildId]);
    },
    async removeReplicaChannel(sourceChannelId, targetChannelId, targetLanguageCode) {
        // remove a channel from the replication list
        return databaseRun(`DELETE FROM replica_channels WHERE source_channel_id = ? AND target_channel_id = ? AND target_language_code= ?`, [sourceChannelId, targetChannelId, targetLanguageCode]);
    },
}