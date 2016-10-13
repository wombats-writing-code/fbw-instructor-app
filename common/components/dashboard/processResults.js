
import _ from 'lodash'

export const uniqueQuestions = (takenResults) => {
  return _.uniqBy(_.flatMap(takenResults, 'questions'), 'itemId');
}

/* given a list of responses, a questionId and the number of attempts,
calculate how many students did not get it correct within numAttempts
**/
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
