
import _ from 'lodash'
let moment = require('moment');
require('moment-timezone');

export const uniqueQuestions = (takenResults) => {
  return _.uniqBy(_.flatMap(takenResults, 'questions'), 'itemId');
}

/* given a list of responses, a questionId and the number of attempts,
calculate how many students did not get it correct within numAttempts
**/
// Note that currently, this seems to ignore the submissionTime
// factor ... so it is possible that someone answered a waypoint
// question in Route 2 correct before answering it wrong in Route 1,
// but here they will show up at requiring 2 attempts.

// Note that this calculation means that the student may NOT have ever gotten it right
export const notCorrectWithinAttempts = (questionId, takenResults, maxAttempts) => {

  return _.compact(_.map(takenResults, (taken) => {
    // console.log(taken);

    // let question = _.find(taken.questions, {itemId: questionId});

    let numAttempts = 0;
    let numSeen = 0;
    for (let i=0; i<taken.questions.length; i++) {
      let question = taken.questions[i];

      // match the question by its itemId
      if (question.itemId === questionId) {
        numSeen++;

        // console.log('matched question. its reponses', question.responses[0]);
        let response = question.responses[0];

        if (response) {
          numAttempts++;

          // console.log(response, 'numAttempts', numAttempts, maxAttempts, 'max attempt');

          // if the response is not correct, and the number of student attempts equals or exceeded the given attempt number,
          // then we say the student has not achieved
          if (!response.isCorrect && numAttempts >= maxAttempts) {
            return taken;
          }
        }

      }
    }

    return null;
  }));

}

/* Kind of a hack ... we know that FbW choiceIds are unique
in the system, even across questions.
*/
export const grabQuestionByChoiceId = (takenResults, choiceId) => {
  let questions = uniqueQuestions(takenResults);
  return _.find(questions, (question) => {
    let choiceIds = _.map(question.choices, 'id');
    return choiceIds.indexOf(choiceId) >= 0;
  });
}

/* To populate the student response matrix, we need to count the number of
 students who select choice X in their Yth attempt.

 Sort the submissions by time?
*/
export const selectedChoiceXWithinAttempts = (takenResults, choiceId, maxAttempts) => {
  let attemptsCounter = [];
  let itemId = grabQuestionByChoiceId(takenResults, choiceId).itemId;
  _.each(takenResults, (taken) => {
    let responses = _.compact(_.concat([], _.flatten(_.map(_.filter(taken.questions, {'itemId': itemId}), 'responses'))));
    responses = _.orderBy(responses, sortBySubmissionTime);

    for (var i=1; i<=maxAttempts; i++) {
      let shiftedIndex = i - 1;
      attemptsCounter[shiftedIndex] = 0;

      if (responses.length >= i && responses.length <= maxAttempts) {
        if (!responses[shiftedIndex].isCorrect) {
          if (responses[shiftedIndex].choiceIds.length == 0) {
            // surrendering is equivalent to not getting it right
            attemptsCounter[shiftedIndex]++;
          } else if (responses[shiftedIndex].choiceIds[0] == choiceId) {
            attemptsCounter[shiftedIndex]++;
          }
        }
      }
    }
  });
  return attemptsCounter;
}

export const sortBySubmissionTime  = (responseA, responseB) => {
  if (responseA && responseB) {
    if (typeof responseA.submissionTime !== "undefined" && typeof responseB.submissionTime !== "undefined") {
      return moment(responseA.submissionTime).unix() < moment(responseB.submissionTime).unix();
    } else if (typeof responseA.submissionTime !== "undefined") {
      return false;
    } else if (typeof responseB.submissionTime !== "undefined") {
      return true;
    } else {
      return true; // arbitrarily let the first unanswered response be <
    }
  } else if (responseA) {
    return false;
  } else if (responseB) {
    return true;
  } else {
    return true;
  }
}
