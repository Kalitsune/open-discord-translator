// translation util
const fs = require('fs');
const path = require('path');


//the folder configs contains the localizations files
// getTranslation(key, localization) returns the key of the translation in the localization file,
// it also supports nested keys, for example:
// getLocalization('settings:language/set', 'en')
// returns the key located in {"settings":{"language":{"set":"hi, I'm the returned value :D"}}} in the en.json file
// https://discord.com/developers/docs/reference#locales
module.exports = {
    getLocalization(key, localization) {
        // normalize localization
        if (localization === 'EnglishUS' || localization === 'EnglishGB') localization = 'English';
        // parse the key
        const domain = key.split(':');
        const keys = domain[1].split('.');

        // load the localizations file
        let translation
        try {
            translation = require(`./configs/${localization}.json`)[domain[0]];
        } catch (e) {
            console.log(`[WARNING] The localization file for ${localization} does not exist.`);
            translation = require(`./configs/English.json`)[domain[0]];
        }

        try {
            // get the translation
            for (const key of keys) {
                translation = translation[key];
            }
        } catch (e) { // fails if the key does not exist in this language
            try {
                // try to get the translation in english
                // console.log(`[WARNING] The key ${key} does not exist in the localization file for ${localization}.`);
                translation = require(`./configs/English.json`)[domain[0]];
                for (const key of keys) {
                    translation = translation[key];
                }
                return translation;
            } catch (e) { // fails if the key does not exist in english
                // at this point, just return the key
                console.log(`[WARNING] The key ${key} does not exist in the localization file for English.`);
                return key;
            }
        }
        return translation;
    },

    getAvailableLocalizations() {
        const localizationsPath = path.join(__dirname, 'configs');
        const localizationsFiles = fs.readdirSync(localizationsPath).filter(file => file.endsWith('.json'));
        return localizationsFiles.map(file => file.slice(0,-5)); //remove the .json extension
    },

    //return an object containing the value of a key in every found localizations
    getKeyLocalizations(key) {
        const localizations = module.exports.getAvailableLocalizations();
        const localizationsValues = {};

        let l;
        for (const localization of localizations) {
            l = module.exports.getLocalization(key, localization);
            if (localization === 'English') {
                localizationsValues["EnglishUS"] = l;
                localizationsValues["EnglishGB"] = l;
            } else {
                localizationsValues[localization] = l;
            }
        }
        return localizationsValues;
    },
}