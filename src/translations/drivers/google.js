const { translate } = require('@vitalets/google-translate-api');

module.exports = {
    async init() {
        // if you need to initialize the driver, do it here
        // you must return the supported source and target languages
        // (be sure to add 'auto' if your driver supports automatic source language detection)

        // return the supported languages
        return supported_languages;
    },
    async translate(text, to, from = "auto") {
        const { raw } = await translate(text, { to, from });
        return { text: raw.sentences[0].trans, from: raw.src };
    }
}

// this can't be over 25 items long because of discord's slash command limit
// this is an arbitrary list of languages, feel free to change it
const supported_languages = [
    {
        "language": "Afrikaans",
        "code": "af"
    },
    {
        "language": "Albanian",
        "code": "sq"
    },
    {
        "language": "Amharic",
        "code": "am"
    },
    {
        "language": "Arabic",
        "code": "ar"
    },
    {
        "language": "Armenian",
        "code": "hy"
    },
    {
        "language": "Azerbaijani",
        "code": "az"
    },
    {
        "language": "Basque",
        "code": "eu"
    },
    {
        "language": "Belarusian",
        "code": "be"
    },
    {
        "language": "Bengali",
        "code": "bn"
    },
    {
        "language": "Bosnian",
        "code": "bs"
    },
    {
        "language": "Bulgarian",
        "code": "bg"
    },
    {
        "language": "Catalan",
        "code": "ca"
    },
    {
        "language": "Cebuano",
        "code": "ceb"
    },
    {
        "language": "Chinese (Simplified)",
        "code": "zh-CN"
    },
    {
        "language": "Chinese (Traditional)",
        "code": "zh-TW"
    },
    {
        "language": "Corsican",
        "code": "co"
    },
    {
        "language": "Croatian",
        "code": "hr"
    },
    {
        "language": "Czech",
        "code": "cs"
    },
    {
        "language": "Danish",
        "code": "da"
    },
    {
        "language": "Dutch",
        "code": "nl"
    },
    {
        "language": "English",
        "code": "en"
    },
    {
        "language": "Esperanto",
        "code": "eo"
    },
    {
        "language": "Estonian",
        "code": "et"
    },
    {
        "language": "Finnish",
        "code": "fi"
    },
    {
        "language": "French",
        "code": "fr"
    },
    {
        "language": "Frisian",
        "code": "fy"
    },
    {
        "language": "Galician",
        "code": "gl"
    },
    {
        "language": "Georgian",
        "code": "ka"
    },
    {
        "language": "German",
        "code": "de"
    },
    {
        "language": "Greek",
        "code": "el"
    },
    {
        "language": "Gujarati",
        "code": "gu"
    },
    {
        "language": "Haitian Creole",
        "code": "ht"
    },
    {
        "language": "Hausa",
        "code": "ha"
    },
    {
        "language": "Hawaiian",
        "code": "haw"
    },
    {
        "language": "Hebrew",
        "code": "iw"
    },
    {
        "language": "Hindi",
        "code": "hi"
    },
    {
        "language": "Hmong",
        "code": "hmn"
    },
    {
        "language": "Hungarian",
        "code": "hu"
    },
    {
        "language": "Icelandic",
        "code": "is"
    },
    {
        "language": "Igbo",
        "code": "ig"
    },
    {
        "language": "Indonesian",
        "code": "id"
    },
    {
        "language": "Irish",
        "code": "ga"
    },
    {
        "language": "Italian",
        "code": "it"
    },
    {
        "language": "Japanese",
        "code": "ja"
    },
    {
        "language": "Javanese",
        "code": "jw"
    },
    {
        "language": "Kannada",
        "code": "kn"
    },
    {
        "language": "Kazakh",
        "code": "kk"
    },
    {
        "language": "Khmer",
        "code": "km"
    },
    {
        "language": "Korean",
        "code": "ko"
    },
    {
        "language": "Kurdish",
        "code": "ku"
    },
    {
        "language": "Kyrgyz",
        "code": "ky"
    },
    {
        "language": "Lao",
        "code": "lo"
    },
    {
        "language": "Latin",
        "code": "la"
    },
    {
        "language": "Latvian",
        "code": "lv"
    },
    {
        "language": "Lithuanian",
        "code": "lt"
    },
    {
        "language": "Luxembourgish",
        "code": "lb"
    },
    {
        "language": "Macedonian",
        "code": "mk"
    },
    {
        "language": "Malagasy",
        "code": "mg"
    },
    {
        "language": "Malay",
        "code": "ms"
    },
    {
        "language": "Malayalam",
        "code": "ml"
    },
    {
        "language": "Maltese",
        "code": "mt"
    },
    {
        "language": "Maori",
        "code": "mi"
    },
    {
        "language": "Marathi",
        "code": "mr"
    },
    {
        "language": "Mongolian",
        "code": "mn"
    },
    {
        "language": "Myanmar (Burmese)",
        "code": "my"
    },
    {
        "language": "Nepali",
        "code": "ne"
    },
    {
        "language": "Norwegian",
        "code": "no"
    },
    {
        "language": "Nyanja (Chichewa)",
        "code": "ny"
    },
    {
        "language": "Pashto",
        "code": "ps"
    },
    {
        "language": "Persian",
        "code": "fa"
    },
    {
        "language": "Polish",
        "code": "pl"
    },
    {
        "language": "Portuguese (Portugal, Brazil)",
        "code": "pt"
    },
    {
        "language": "Punjabi",
        "code": "pa"
    },
    {
        "language": "Romanian",
        "code": "ro"
    },
    {
        "language": "Russian",
        "code": "ru"
    },
    {
        "language": "Samoan",
        "code": "sm"
    },
    {
        "language": "Scots Gaelic",
        "code": "gd"
    },
    {
        "language": "Serbian",
        "code": "sr"
    },
    {
        "language": "Sesotho",
        "code": "st"
    },
    {
        "language": "Shona",
        "code": "sn"
    },
    {
        "language": "Sindhi",
        "code": "sd"
    },
    {
        "language": "Sinhala (Sinhalese)",
        "code": "si"
    },
    {
        "language": "Slovak",
        "code": "sk"
    },
    {
        "language": "Slovenian",
        "code": "sl"
    },
    {
        "language": "Somali",
        "code": "so"
    },
    {
        "language": "Spanish",
        "code": "es"
    },
    {
        "language": "Sundanese",
        "code": "su"
    },
    {
        "language": "Swahili",
        "code": "sw"
    },
    {
        "language": "Swedish",
        "code": "sv"
    },
    {
        "language": "Tagalog (Filipino)",
        "code": "tl"
    },
    {
        "language": "Tajik",
        "code": "tg"
    },
    {
        "language": "Tamil",
        "code": "ta"
    },
    {
        "language": "Telugu",
        "code": "te"
    },
    {
        "language": "Thai",
        "code": "th"
    },
    {
        "language": "Turkish",
        "code": "tr"
    },
    {
        "language": "Ukrainian",
        "code": "uk"
    },
    {
        "language": "Urdu",
        "code": "ur"
    },
    {
        "language": "Uzbek",
        "code": "uz"
    },
    {
        "language": "Vietnamese",
        "code": "vi"
    },
    {
        "language": "Welsh",
        "code": "cy"
    },
    {
        "language": "Xhosa",
        "code": "xh"
    },
    {
        "language": "Yiddish",
        "code": "yi"
    },
    {
        "language": "Yoruba",
        "code": "yo"
    },
    {
        "language": "Zulu",
        "code": "zu"
    }
]