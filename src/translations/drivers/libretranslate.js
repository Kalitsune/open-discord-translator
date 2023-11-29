const axios = require("axios");
const handleAxiosErrors = require("../../helpers/handleAxiosErrors");
const dictToFormData = (dict) => {
    const formData = new FormData();
    Object.entries(dict).forEach(([key, value]) => formData.append(key, value));
    return formData;
}

module.exports = {
    async init() {
        const response = await axios.get(`${process.env.LIBRETRANSLATE_URL}/languages`);

        handleAxiosErrors(response);

        return response.data.map(language => {
            return {
                name: language.name,
                code: language.code
            }
        });
    },
    async translate(text, to = "en", from = undefined) {
        if (!from) {
            const detectResponse = await axios.post(`${process.env.LIBRETRANSLATE_URL}/detect`, dictToFormData({ q: text }));

            handleAxiosErrors(detectResponse);

            from = detectResponse.data[0].language;
        }

        const response = await axios.post(`${process.env.LIBRETRANSLATE_URL}/translate`, dictToFormData({
            q: text,
            source: from,
            target: to,
            format: "text"
        }));

        handleAxiosErrors(response);

        return {text: response.data.translatedText, from};
    }
}