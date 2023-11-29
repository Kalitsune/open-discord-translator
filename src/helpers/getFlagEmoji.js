function getFlagEmoji (countryCode) {
  // if country code is empty return the globe emoji
  if (!countryCode) return "🌐";

  // fix some country codes
  if (countryCode === 'ja') countryCode = 'jp';
  if (countryCode === 'ko') countryCode = 'kr';
  if (countryCode === 'en') countryCode = ['gb','us'][Math.floor(Math.random()*2)];
  if (countryCode === 'en-GB') countryCode = 'gb';
  if (countryCode === 'en-US') countryCode = 'us';
  if (countryCode === 'zh-CN') countryCode = 'cn';
  if (countryCode === 'zh-TW') countryCode = 'tw';

  return countryCode.replace(/./g,(ch)=>String.fromCodePoint(0x1f1a5+ch.toUpperCase().charCodeAt()))
}

module.exports = {getFlagEmoji}
