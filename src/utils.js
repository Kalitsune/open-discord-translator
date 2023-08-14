module.exports = {
    getFlagEmoji (countryCode) {
        // en is not a flag so pick gb/us instead
        if (countryCode === 'ja') countryCode = 'jp';
        if (countryCode === 'en') countryCode = ['gb','us'][Math.floor(Math.random()*2)];
        if (countryCode === 'en-GB') countryCode = 'gb';
        if (countryCode === 'en-US') countryCode = 'us';

        return countryCode.replace(/./g,(ch)=>String.fromCodePoint(0x1f1a5+ch.toUpperCase().charCodeAt()))
    }
}