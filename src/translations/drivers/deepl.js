const {Translator, TooManyRequestsError, QuotaExceededError} = require('deepl-node');
const googleTranslate = require('./google_search.js');

let translator;
module.exports = {
    async init() {
        //init deepl api
        translator = new Translator(process.env.DEEPL_API_KEY, {sendPlatformInfo: false});

        // return the supported languages (as time of writing: bg,cs,da,de,el,en,es,et,fi,fr,hu,id,it,ja,ko,lt,lv,nb,nl,pl,pt,ro,ru,sk,sl,sv,tr,uk,zh)
        return await translator.getSourceLanguages();
    },
    async translate(text, to, from= null) {
        // translate the text
        try {
            //                                                   Deepl doesn't support en as target language, so we use en-US instead
            const translation = await translator.translateText(text, from, to === "en" ? "en-US" : to);
            // you must return the translated text and the source language, if it is auto, then return the detected language
            return {text: translation.text, from: translation.detectedSourceLang};
        } catch (e) {
            if (e instanceof TooManyRequestsError || e instanceof QuotaExceededError) {
                // use google translate api as fallback
                return googleTranslate.translate(text, to, from);
            } else {
                throw e;
            }
        }
    }
}