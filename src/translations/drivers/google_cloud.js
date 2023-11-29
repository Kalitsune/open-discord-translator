const axios = require('axios');
const error = require('../../errors.js');
const handleAxiosErrors = require("../../helpers/handleAxiosErrors");

module.exports = {
    async init() {
        // if you need to initialize the driver, do it here
        // you must return the supported source and target languages
        // (be sure to add 'auto' if your driver supports automatic source language detection)

        // request the supported languages from the google translate translations
        const res = await axios.get(`https://translation.googleapis.com/language/translate/v2/languages?key=${process.env.GOOGLE_APPLICATION_CREDENTIALS}`, {validateStatus: () => true});

        // handle errors
        handleAxiosErrors(res);

        // return the supported languages but rename the `language` field to `name`
        return res.data.data.languages.map((lang) => {
            return {name: lang.language, code: lang.code};
        });
    },
    async translate(text, to, from = undefined) {
        to = to || "en"
        // needs $GOOGLE_APPLICATION_CREDENTIALS
        // request the translation from the google translation translations
        let res = await axios.post(
            `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
            { q: text, target: to, source: from}, {validateStatus: () => true}
        );

        // handle errors
        handleAxiosErrors(res);

        return {text: res.data.data.translations[0].translatedText, from: res.data.data.translations[0].detectedSourceLanguage, to};
    },
    name: "Google translate"
}
