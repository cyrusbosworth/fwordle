const got = require('got');
let words = Runtime.getAssets()['/words.txt'].open().toString().split('\n');
const randomWord = () => {
  return words[(words.length * Math.random()) | 0];
};
const maxGuesses = 5;
const wordLength = 5;

const handleGuess = async (player, guess) => {
  let newScoreCard = [];
  try {
    const response = await got(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${guess}`
    ).json();
    if (response.statusCode !== 404) {
      player.guessesAttempted += 1;
      for (let i = 0; i < guess.length; i++) {
        if (guess.charAt(i) == player.randWord.charAt(i)) {
          if (player.dupLetters[i] != null) {
            player.numCorrectLetters += 1;
          }
          player.dupLetters[i] = null;
          newScoreCard.push('🟩');
        } else if (
          guess.charAt(i) != player.randWord.charAt(i) &&
          player.randWord.includes(guess.charAt(i))
        ) {
          newScoreCard.push('🟨');
        } else {
          if (!player.incorrectLettersArr.includes(guess.charAt(i)));
          {
            player.incorrectLettersArr.push(guess.charAt(i));
          }
          newScoreCard.push('⬛');
        }
      }
      console.log(`newScoreCard ${newScoreCard}`);
      return newScoreCard;
    } else {
      //404 word not in dict
      newScoreCard = 'word not found in dictionary! try again!';
      console.log('Word not found!');
      return newScoreCard;
    }
  } catch (err) {
    newScoreCard = 'word not found in dictionary! try again!';
    console.log('Word not found!');
    return newScoreCard;
  }
};

const endFunc = (player, scoreCard) => {
  if (player.guessesAttempted >= maxGuesses) {
    console.log(`guessesAttempted >= maxGuesses`);
    return true;
  } else if (player.numCorrectLetters == wordLength) {
    console.log('in numCorrect');
    return true;
  } else if (scoreCard == `🟩,🟩,🟩,🟩,🟩`) {
    console.log(`scorecard = 🟩,🟩,🟩,🟩,🟩`);
    return true;
  } else {
    console.log(`game still going`);
    return false;
  }
};

exports.handler = async function (context, event, callback) {
  let twiml = new Twilio.twiml.MessagingResponse();
  let responseText = '';
  let guess = event.Body.toLowerCase().trim();
  let response = new Twilio.Response();
  let player;
};
