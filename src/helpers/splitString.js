function splitString(str, maxLength) {
  if (str.length <= maxLength) {
      return [str];
  }

  const chunks = [];
  let currentChunk = '';

  // split the string into chunks
  let advancement = 0;
  while (advancement < str.length) {
      // get the next chunk
      currentChunk = str.substring(advancement, (advancement + maxLength) > str.length ? str.length : (advancement + maxLength));

      // the `end` variable will be used to check if there's a smart way to split the chunks or not
      const end = currentChunk.substring(currentChunk.length - (currentChunk.length < 100 ? currentChunk.length : 100), currentChunk.length);

      //check if there's .!? in the end var so that we can split there.
      // also check for the first encountered space in case we don't find any of the above
      let space;
      for (let i = end.length; i > 0; i--) {
          if (end[i] === '.' || end[i] === '!' || end[i] === '?') {
              // check if there's a space after the punctuation
              if (end[i + 1] === ' ') {
                  // if there's a match, add the chunk to the chunks array
                  chunks.push(currentChunk.substring(0, currentChunk.length - (end.length - i)));
                  // record the advancement
                  advancement += currentChunk.length - (end.length - i);
                  // wipe the current chunk
                  currentChunk = '';
                  //and break the loop
                  break;
              }
          } else if (!space &&end[i] === ' ') {
              space = i;
          }
      }

      // check if the current chunk was split
      if (currentChunk.length > 0) {
          // if not check if we found a space
          if (space) {
              // if we did, split the chunk there
              chunks.push(currentChunk.substring(0, currentChunk.length - (end.length - space)));
              // record the advancement
              advancement += currentChunk.length - (end.length - space);
              // wipe the current chunk
              currentChunk = '';
          } else {
              // if we haven't found anything, split the chunk there even if it's unnatural
              chunks.push(currentChunk);
              // record the advancement
              advancement += currentChunk.length;
              // wipe the current chunk
              currentChunk = '';
          }
      }
  }
  return chunks;
}

module.exports = {splitString}
