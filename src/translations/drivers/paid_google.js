const axios = require('axios');
const error = require('../../errors.js');

function handleErrors(response) {
    if (response.data.error) {
        console.log(response.data.error.status);
        //catch errors and bind them to an existing error class
        if (["UNAUTHENTICATED", "PERMISSION_DENIED"].includes(response.data.error.status)) {
            throw new error.errUnauthorized(response.data.error.message);
        } else if (["Daily Limit Exceeded", "User Rate Limit Exceeded", "Quota Exceeded"].includes(response.data.error.message)) {
            throw new error.errMaxQuota(response.data.error.message);
        } else if (["Rate Limit Exceeded"].includes(response.data.error.message)) {
            throw new error.errRateLimit(response.data.error.message);
        } else if (["INVALID_ARGUMENT", "FAILED_PRECONDITION", "OUT_OF_RANGE", "UNIMPLEMENTED", "INTERNAL", "UNAVAILABLE", "DATA_LOSS"].includes(response.data.error.status)){
            throw new error.errBadRequest(response.data.error.message);
        } else {
            throw new error.errUnknown(response.data.error.message);
        }
    }
}

module.exports = {
    async init() {
        // if you need to initialize the driver, do it here
        // you must return the supported source and target languages
        // (be sure to add 'auto' if your driver supports automatic source language detection)

        // request the supported languages from the google translate translations
        const res = await axios.get(`https://translation.googleapis.com/language/translate/v2/languages?key=${process.env.GOOGLE_APPLICATION_CREDENTIALS}`, {validateStatus: () => true});

        // handle errors
        handleErrors(res);

        // return the supported languages but rename the `language` field to `name`
        return res.data.data.languages.map((lang) => {
            return {name: lang.language, code: lang.code};
        });
    },
    async translate(text, to, from = undefined) {
        // translate the text from the source language to the target language
        // return the translated text
        // feel free to add more environment variables if needed (don't forget to update the readme)

        // needs $GOOGLE_APPLICATION_CREDENTIALS
        // request the translation from the google translation translations
        let res = await axios.post(
            `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
            { q: text, target: to, source: from}, {validateStatus: () => true}
        );

        // handle errors
        handleErrors(res);

        return {text: res.data.data.translations[0].translatedText, from: res.data.data.translations[0].detectedSourceLanguage};
    }
}