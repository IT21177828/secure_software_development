import badWordsList from "../db/badWords.js";
import logger from "../logger/logger.js";
function hide(word) {
  let staredWord = "";
  for (let index = 0; index < word.length; index++) {
    staredWord += "X";
  }
  return staredWord;
}

export function myPromises(sentence) {
  return new Promise((resolve, reject) => {
    try {
      const badWordsContainer = [];
      const text = sentence.toUpperCase().trim();
      let startPhase = sentence;
      let hasBadWords = false;

      badWordsList.forEach((word) => {
        if (text.includes(word.toUpperCase())) {
          badWordsContainer.push(word);
          const hidWord = hide(word);
          startPhase = startPhase.replaceAll(word, hidWord);
        }
      });

      if (badWordsContainer.length) {
        hasBadWords = true;
        logger.info("Bad words found in the sentence");
      }
      resolve({ badWordsContainer, hasBadWords, startPhase });
      logger.info("Bad words not found in the sentence");
    } catch (error) {
      reject(error);
      logger.error("Error in finding bad words");
    }
  });
}
