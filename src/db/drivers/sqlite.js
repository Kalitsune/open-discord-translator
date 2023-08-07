

module.exports = {
    async init() {
        // if you need to initialize the driver, do it here
        // feel free to add more environment variables if needed (don't forget to update the readme)
    },
    async getLanguage(userId) {
        // get the language code associated with the user id
        // return the value
    },
    async setLanguage(userId, languageCode) {
        // set the language code for this user id
    },
    async addReplicaChannels(sourceChannelId, targetChannelId, targetLanguageCode) {
        // add a channel to be replicated in another languages
    },
    async getReplicaChannels() {
        // get all the channels to be replicated
    },
    async removeReplicaChannels(sourceChannelId, targetChannelId) {
        // remove a channel from the replication list
    },
}